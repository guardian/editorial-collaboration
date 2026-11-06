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

const isFullyCoveredByRanges = (from: number, to: number, ranges: AdditionRange[]): boolean => {
  if (to <= from) {
    return false;
  }
  let cursor = from;
  for (const range of ranges) {
    if (range.to <= cursor) {
      continue;
    }
    if (range.from > cursor) {
      return false;
    }
    cursor = Math.max(cursor, range.to);
    if (cursor >= to) {
      return true;
    }
  }
  return false;
};

const getVersionHistoryDecorationRanges = (doc: Node, steps: Step[], stepSelection: StepSelection): Result<Decoration[]> => {
  if (stepSelection.from < 0 || stepSelection.to > steps.length) {
    return failWith(`Step selection to index ${stepSelection.to} is greater than the number of steps ${steps.length}`);
  }
  let currentDoc = doc;
  let selectedStartDoc: Node | null = null;
  let additions: AdditionRange[] = [];
  const deletions: DeletionMarker[] = [];

  for (let index = 0; index < stepSelection.to; index += 1) {
    const step = steps[index];
    if (step == null) {
      continue;
    }

    const map = step.getMap();
    for (let i = 0; i < deletions.length; i += 1) {
      const deletion = deletions[i];
      if (deletion == null) {
        continue;
      }
      deletion.pos = map.map(deletion.pos, -1);
    }

    if (index === stepSelection.from) {
      selectedStartDoc = currentDoc;
    }

    if (index >= stepSelection.from) {
      const stepAdditions: AdditionRange[] = [];
      map.forEach((fromA, toA, fromB, toB) => {
        if (toA > fromA) {
          const deletedText = currentDoc.textBetween(fromA, toA, '\n', '\n');
          const deletedSelectedAddition = isFullyCoveredByRanges(fromA, toA, additions);
          if (deletedText.length > 0 && !deletedSelectedAddition) {
            deletions.push({ pos: fromB, text: deletedText });
          }
        }
        if (toB > fromB) {
          stepAdditions.push({ from: fromB, to: toB });
        }
      });
      additions = normaliseRanges([
        ...additions.map(addition => ({
          from: map.map(addition.from, 1),
          to: map.map(addition.to, -1),
        })),
        ...stepAdditions
      ]);
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
  if (additions.length > 0 && deletions.length > 0 && startText === endText) {
    return succeedWith([]);
  }

  const additionDecorations: Decoration[] = additions.map(addition =>
    Decoration.inline(
      addition.from,
      addition.to,
      { class: 'version-history-addition' },
      { changeType: 'addition' }
    ));

  const deletionDecorations: Decoration[] = deletions.map(deletion =>
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