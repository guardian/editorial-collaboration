import type { Node } from 'prosemirror-model';
import type { Step } from 'prosemirror-transform';
import { Step as ProsemirrorStep } from 'prosemirror-transform';
import { Decoration } from 'prosemirror-view';
import type { Result} from '../model/result';
import { failWith, succeedWith } from '../model/result';
import type { SendableSteps, StepSelection } from '../model/steps';

/**
 * Takes a document and an array of steps to apply to the document. It simplifies the steps into additions and deletions,
 * and returns and array of decorations that can be used to highlight the changes in the document.
 */

type AdditionRange = { from: number; to: number };
type DeletionMarker = { pos: number; text: string };
type ChangeSegment = {
  deletionStart: number;
  deletionEnd: number;
  additionStart: number;
  additionEnd: number;
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
    deletionStart,
    deletionEnd,
    additionStart,
    additionEnd,
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
    deletionStart += 1;
    additionStart += 1;
  }

  while (
    deletedText.length > 0 &&
    addedText.length > 0 &&
    // eslint-disable-next-line @typescript-eslint/prefer-string-starts-ends-with -- checking equality, not starts with
    deletedText[deletedText.length - 1] === addedText[addedText.length - 1]
  ) {
    deletedText = deletedText.slice(0, -1);
    addedText = addedText.slice(0, -1);
    deletionEnd -= 1;
    additionEnd -= 1;
  }

  return {
    deletionStart,
    deletionEnd,
    additionStart,
    additionEnd,
    deletedText,
    addedText,
  };
};

type DiffOpType = 'equal' | 'delete' | 'insert';
type DiffOp = { type: DiffOpType; text: string };
type FlattenedDoc = { text: string; charPositions: Array<number | null> };
type AttributedUser = SendableSteps['user'];
type AttributedStep = { step: Step; user?: AttributedUser };
type AttributedStepGroup = { steps: AttributedStep[]; user?: AttributedUser };
type DecorationAttribution = {
  user?: AttributedUser;
  names: string[];
  title: string;
};

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

const flattenDoc = (doc: Node): FlattenedDoc => {
  const from = 0;
  const to = doc.content.size;
  const blockSeparator = '\n';
  const leafText = '\n';
  let text = '';
  const charPositions: Array<number | null> = [];
  let first = true;

  doc.nodesBetween(from, to, (node, pos) => {
    const nodeText = node.isText
      ? (node.text ?? '').slice(Math.max(from, pos) - pos, to - pos)
      : !node.isLeaf
        ? ''
        : leafText;

    const hasLeafText = node.isLeaf && nodeText.length > 0;
    if (node.isBlock && (hasLeafText || node.isTextblock)) {
      if (first) {
        first = false;
      } else {
        text += blockSeparator;
        Array.from(blockSeparator).forEach(() => charPositions.push(null));
      }
    }

    if (nodeText.length === 0) {
      return;
    }

    text += nodeText;
    const characters = Array.from(nodeText);
    if (node.isText) {
      characters.forEach((_, index) => charPositions.push(pos + index));
      return;
    }
    characters.forEach(() => charPositions.push(pos));
  }, 0);

  return { text, charPositions };
};

const textIndexToDocPosition = (textIndex: number, charPositions: Array<number | null>): number => {
  const clampedIndex = Math.max(0, Math.min(textIndex, charPositions.length));
  const leftPosition = (clampedIndex > 0) ? (charPositions[clampedIndex - 1] ?? null) : null;
  const rightPosition = (clampedIndex < charPositions.length) ? (charPositions[clampedIndex] ?? null) : null;

  if (leftPosition != null && rightPosition == null) {
    return leftPosition + 1;
  }
  if (rightPosition != null) {
    return rightPosition;
  }
  if (leftPosition != null) {
    return leftPosition + 1;
  }
  return 1;
};

const hasSendableStepShape = (value: unknown): value is SendableSteps => {
  return typeof value === 'object' && value != null && 'clientTimestamp' in value && 'steps' in value;
};

const isSendableStepsArray = (steps: Step[] | SendableSteps[]): steps is SendableSteps[] => {
  return hasSendableStepShape(steps[0]);
};

const getAttributedStepGroups = (steps: Step[] | SendableSteps[], stepSchema: Node['type']['schema']): AttributedStepGroup[] => {
  if (!isSendableStepsArray(steps)) {
    return steps.map(step => ({ steps: [{ step }] }));
  }

  return steps.map(entry => ({
    user: entry.user,
    steps: entry.steps.map(rawStep => ({
      step: ProsemirrorStep.fromJSON(stepSchema, rawStep),
      user: entry.user,
    })),
  }));
};

const getUserName = (user?: AttributedUser): string | null => {
  if (user == null) {
    return null;
  }
  return `${user.firstName} ${user.lastName}`.trim();
};

const getDecorationAttribution = (stepGroups: AttributedStepGroup[], selection: StepSelection): DecorationAttribution | undefined => {
  const names = Array.from(new Set(
    stepGroups
      .slice(selection.from, selection.to)
      .map(group => getUserName(group.user))
      .filter((name): name is string => name != null && name.length > 0)
  ));

  if (names.length === 0) {
    return undefined;
  }

  if (names.length === 1) {
    const singleUser = stepGroups
      .slice(selection.from, selection.to)
      .map(group => group.user)
      .find((user): user is NonNullable<AttributedUser> => user != null);
    return {
      user: singleUser,
      names,
      title: `Changed by ${names[0]}`,
    };
  }

  return {
    names,
    title: `Changes by ${names.join(', ')}`,
  };
};

const getNetChanges = (
  startDoc: Node,
  endDoc: Node,
): { additions: AdditionRange[]; deletions: DeletionMarker[] } => {
  const { text: startText } = flattenDoc(startDoc);
  const { text: endText, charPositions: endCharPositions } = flattenDoc(endDoc);
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
      deletionStart: segmentStartInStart,
      deletionEnd: segmentStartInStart + Array.from(deletedText).length,
      additionStart: segmentStartInEnd,
      additionEnd: segmentStartInEnd + Array.from(addedText).length,
      deletedText,
      addedText,
    });

    if (segment.additionEnd > segment.additionStart) {
      const from = textIndexToDocPosition(segment.additionStart, endCharPositions);
      const to = textIndexToDocPosition(segment.additionEnd, endCharPositions);
      if (to <= from) {
        continue;
      }
      additions.push({
        from,
        to,
      });
    }
    if (segment.deletedText.length > 0 && segment.deletionEnd > segment.deletionStart) {
      deletions.push({
        pos: textIndexToDocPosition(segment.additionStart, endCharPositions),
        text: segment.deletedText,
      });
    }
  }

  return {
    additions: normaliseRanges(additions),
    deletions,
  };
};

const getVersionHistoryDecorationRanges = (doc: Node, inputSteps: Step[] | SendableSteps[], stepSelection: StepSelection): Result<Decoration[]> => {
  const stepGroups = getAttributedStepGroups(inputSteps, doc.type.schema);
  if (stepSelection.from < 0 || stepSelection.to > stepGroups.length) {
    return failWith(`Step selection to index ${stepSelection.to} is greater than the number of steps ${stepGroups.length}`);
  }
  let currentDoc = doc;
  let selectedStartDoc: Node | null = null;
  const attribution = getDecorationAttribution(stepGroups, stepSelection);

  for (let groupIndex = 0; groupIndex < stepSelection.to; groupIndex += 1) {
    const group = stepGroups[groupIndex];
    if (group == null) {
      continue;
    }

    if (groupIndex === stepSelection.from) {
      selectedStartDoc = currentDoc;
    }

    for (const attributedStep of group.steps) {
      const applied = attributedStep.step.apply(currentDoc);
      if (applied.failed != null) {
        return failWith(applied.failed);
      }
      if (applied.doc == null) {
        return failWith('Step application did not return a document');
      }
      currentDoc = applied.doc;
    }
  }

  const effectiveStartDoc = selectedStartDoc ?? currentDoc;
  const startText = flattenDoc(effectiveStartDoc).text;
  const endText = flattenDoc(currentDoc).text;
  if (startText === endText) {
    return succeedWith([]);
  }

  const finalChanges = getNetChanges(effectiveStartDoc, currentDoc);
  const attributionUserNames = attribution?.names.join(', ');
  const additionDomAttributes = {
    class: 'version-history-addition',
    ...(attribution?.title != null ? { title: attribution.title } : {}),
    ...(attributionUserNames != null ? { 'data-version-history-user': attributionUserNames } : {}),
  };

  const additionDecorations: Decoration[] = finalChanges.additions.map(addition =>
    Decoration.inline(
      addition.from,
      addition.to,
      additionDomAttributes,
      { changeType: 'addition', user: attribution?.user, users: attribution?.names }
    ));

  const deletionDecorations: Decoration[] = finalChanges.deletions.map(deletion =>
    Decoration.widget(
      deletion.pos,
      () => {
        const span = document.createElement('span');
        span.className = 'version-history-deletion';
        span.textContent = deletion.text;
        if (attribution != null) {
          span.title = attribution.title;
          span.setAttribute('data-version-history-user', attribution.names.join(', '));
        }
        return span;
      },
      { side: -1, changeType: 'deletion', deletedText: deletion.text, user: attribution?.user, users: attribution?.names }
    ));

  return succeedWith([...additionDecorations, ...deletionDecorations]);
};

export { getVersionHistoryDecorationRanges };