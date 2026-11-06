import type { Node } from 'prosemirror-model';
import type { Step } from 'prosemirror-transform';
import { Decoration } from 'prosemirror-view';
import type { Result} from '../model/result';
import { failWith, succeedWith } from '../model/result';
import type { StepSelection } from '../model/steps';

/**
 * Takes a document and an array of steps to apply to the document. It simplifies the steps into additions and deletions,
 * and returns and array of decorations that can be used to highlight the changes in the document.
 */

type AdditionRange = { from: number; to: number };
type DeletionMarker = { pos: number; text: string };
type ChangeSegment = {
  deletionFrom: number;
  deletionTo: number;
  additionFrom: number;
  additionTo: number;
  deletedText: string;
  addedText: string;
};

const normaliseRanges = (ranges: AdditionRange[]): AdditionRange[] =>
  ranges
    .filter(range => range.to > range.from)
    .sort((a, b) => a.from - b.from)
    .reduce<AdditionRange[]>((accumulator, range) => {
      const previous = accumulator[accumulator.length - 1];
      if ((previous != null) && range.from <= previous.to) {
        previous.to = Math.max(previous.to, range.to);
      } else {
        accumulator.push({ ...range });
      }
      return accumulator;
    }, []);

const trimSharedEdges = (segment: ChangeSegment): ChangeSegment => {
  let {
    deletionFrom,
    deletionTo,
    additionFrom,
    additionTo,
    deletedText,
    addedText,
  } = segment;

  while (
    deletedText.length > 0 &&
    addedText.length > 0 &&
    // eslint-disable-next-line @typescript-eslint/prefer-string-starts-ends-with -- checking equality, not starts with
    deletedText[0] === addedText[0]
  ) {
    deletedText = deletedText.slice(1);
    addedText = addedText.slice(1);
    deletionFrom += 1;
    additionFrom += 1;
  }

  while (
    deletedText.length > 0 &&
    addedText.length > 0 &&
    // eslint-disable-next-line @typescript-eslint/prefer-string-starts-ends-with -- checking equality, not starts with
    deletedText[deletedText.length - 1] === addedText[addedText.length - 1]
  ) {
    deletedText = deletedText.slice(0, -1);
    addedText = addedText.slice(0, -1);
    deletionTo -= 1;
    additionTo -= 1;
  }

  return {
    deletionFrom,
    deletionTo,
    additionFrom,
    additionTo,
    deletedText,
    addedText,
  };
};

type DiffOpType = 'equal' | 'delete' | 'insert';
type DiffOp = { type: DiffOpType; text: string };

const buildDiffOps = (startText: string, endText: string): DiffOp[] => {
  const startChars = Array.from(startText);
  const endChars = Array.from(endText);
  const m = startChars.length;
  const n = endChars.length;
  const lcs: number[][] = Array.from({ length: m + 1 }, () => Array.from({ length: n + 1 }, () => 0));

  for (let i = m - 1; i >= 0; i -= 1) {
    for (let j = n - 1; j >= 0; j -= 1) {
      if (startChars[i] === endChars[j]) {
        lcs[i]![j] = (lcs[i + 1]![j + 1] ?? 0) + 1;
      } else {
        lcs[i]![j] = Math.max(lcs[i + 1]![j] ?? 0, lcs[i]![j + 1] ?? 0);
      }
    }
  }

  const pushOp = (ops: DiffOp[], type: DiffOpType, character: string) => {
    const previous = ops[ops.length - 1];
    if (previous != null && previous.type === type) {
      previous.text += character;
      return;
    }
    ops.push({ type, text: character });
  };

  const ops: DiffOp[] = [];
  let i = 0;
  let j = 0;
  while (i < m && j < n) {
    if (startChars[i] === endChars[j]) {
      pushOp(ops, 'equal', startChars[i] ?? '');
      i += 1;
      j += 1;
      continue;
    }
    if ((lcs[i + 1]?.[j] ?? 0) >= (lcs[i]?.[j + 1] ?? 0)) {
      pushOp(ops, 'delete', startChars[i] ?? '');
      i += 1;
      continue;
    }
    pushOp(ops, 'insert', endChars[j] ?? '');
    j += 1;
  }
  while (i < m) {
    pushOp(ops, 'delete', startChars[i] ?? '');
    i += 1;
  }
  while (j < n) {
    pushOp(ops, 'insert', endChars[j] ?? '');
    j += 1;
  }
  return ops;
};

const getNetChanges = (
  startDoc: Node,
  endDoc: Node,
): { additions: AdditionRange[]; deletions: DeletionMarker[] } => {
  const startText = startDoc.textBetween(0, startDoc.content.size, '\n', '\n');
  const endText = endDoc.textBetween(0, endDoc.content.size, '\n', '\n');
  const ops = buildDiffOps(startText, endText);

  const additions: AdditionRange[] = [];
  const deletions: DeletionMarker[] = [];

  let startIndex = 0;
  let endIndex = 0;
  for (let index = 0; index < ops.length; index += 1) {
    const op = ops[index];
    if (op == null) {
      continue;
    }
    if (op.type === 'equal') {
      const length = Array.from(op.text).length;
      startIndex += length;
      endIndex += length;
      continue;
    }

    const segmentStartInStart = startIndex;
    const segmentStartInEnd = endIndex;
    let deletedText = '';
    let addedText = '';

    while (index < ops.length) {
      const segmentOp = ops[index];
      if (segmentOp == null || segmentOp.type === 'equal') {
        break;
      }
      const length = Array.from(segmentOp.text).length;
      if (segmentOp.type === 'delete') {
        deletedText += segmentOp.text;
        startIndex += length;
      } else {
        addedText += segmentOp.text;
        endIndex += length;
      }
      index += 1;
    }
    index -= 1;

    const segment = trimSharedEdges({
      deletionFrom: segmentStartInStart + 1,
      deletionTo: segmentStartInStart + Array.from(deletedText).length + 1,
      additionFrom: segmentStartInEnd + 1,
      additionTo: segmentStartInEnd + Array.from(addedText).length + 1,
      deletedText,
      addedText,
    });

    if (segment.additionTo > segment.additionFrom) {
      additions.push({ from: segment.additionFrom, to: segment.additionTo });
    }
    if (segment.deletedText.length > 0 && segment.deletionTo > segment.deletionFrom) {
      deletions.push({ pos: segment.additionFrom, text: segment.deletedText });
    }
  }

  return {
    additions: normaliseRanges(additions),
    deletions,
  };
};

const getVersionHistoryDecorationRanges = (doc: Node, steps: Step[], stepSelection: StepSelection): Result<Decoration[]> => {
  if (stepSelection.from < 0 || stepSelection.to > steps.length) {
    return failWith(`Step selection to index ${stepSelection.to} is greater than the number of steps ${steps.length}`);
  }
  let currentDoc = doc;
  let selectedStartDoc: Node | null = null;

  for (let index = 0; index < stepSelection.to; index += 1) {
    const step = steps[index];
    if (step == null) {
      continue;
    }

    if (index === stepSelection.from) {
      selectedStartDoc = currentDoc;
    }

    const applied = step.apply(currentDoc);
    if (applied.failed != null) {
      return failWith(applied.failed);
    }
    if (applied.doc == null) {
      return failWith('Step application did not return a document');
    }
    currentDoc = applied.doc;
  }

  const effectiveStartDoc = selectedStartDoc ?? currentDoc;
  const startText = effectiveStartDoc.textBetween(0, effectiveStartDoc.content.size, '\n', '\n');
  const endText = currentDoc.textBetween(0, currentDoc.content.size, '\n', '\n');
  if (startText === endText) {
    return succeedWith([]);
  }

  const finalChanges = getNetChanges(effectiveStartDoc, currentDoc);

  const additionDecorations: Decoration[] = finalChanges.additions.map(addition =>
    Decoration.inline(
      addition.from,
      addition.to,
      { class: 'version-history-addition' },
      { changeType: 'addition' }
    ));

  const deletionDecorations: Decoration[] = finalChanges.deletions.map(deletion =>
    Decoration.widget(
      deletion.pos,
      () => {
        const span = document.createElement('span');
        span.className = 'version-history-deletion';
        span.textContent = deletion.text;
        return span;
      },
      { side: -1, changeType: 'deletion', deletedText: deletion.text }
    ));

  return succeedWith([...additionDecorations, ...deletionDecorations]);
};

export { getVersionHistoryDecorationRanges };