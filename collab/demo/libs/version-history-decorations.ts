import type { Node } from 'prosemirror-model';
import type { Step } from 'prosemirror-transform';
import { Decoration } from 'prosemirror-view';
import type { Result} from '../model/result';
import { failWith, succeedWith } from '../model/result';
import type { StepSelection } from '../model/steps';

type AdditionRange = { from: number; to: number };
type DeletionMarker = { pos: number; text: string };
/**
 * Takes a document and an array of steps to apply to the document. It simplifies the steps into additions and deletions,
 * and returns and array of decorations that can be used to highlight the changes in the document.
 */
const getVersionHistoryDecorationRanges = (doc: Node, steps: Step[], stepSelection: StepSelection): Result<Decoration[]> => {
  if (stepSelection.from < 0 || stepSelection.to > steps.length) {
    return failWith(`Step selection to index ${stepSelection.to} is greater than the number of steps ${steps.length}`);
  }
  let currentDoc = doc;
  let selectedStartDoc: Node | null = null;
  const additions: AdditionRange[] = [];
  const deletions: DeletionMarker[] = [];

  for (let index = 0; index < stepSelection.to; index += 1) {
    const step = steps[index];
    if (step == null) {
      continue;
    }

    const map = step.getMap();
    for (let i = 0; i < additions.length; i += 1) {
      const addition = additions[i];
      if (addition == null) {
        continue;
      }
      addition.from = map.map(addition.from, 1);
      addition.to = map.map(addition.to, -1);
    }
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
      map.forEach((fromA, toA, fromB, toB) => {
        if (toB > fromB) {
          additions.push({ from: fromB, to: toB });
        }
        if (toA > fromA) {
          const deletedText = currentDoc.textBetween(fromA, toA, '\n', '\n');
          if (deletedText.length > 0) {
            deletions.push({ pos: fromB, text: deletedText });
          }
        }
      });
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

  const mergedAdditions = additions
    .filter(addition => addition.to > addition.from)
    .sort((a, b) => a.from - b.from)
    .reduce<AdditionRange[]>((accumulator, addition) => {
      const previous = accumulator[accumulator.length - 1];
      if ((previous != null) && addition.from <= previous.to) {
        previous.to = Math.max(previous.to, addition.to);
      } else {
        accumulator.push({ ...addition });
      }
      return accumulator;
    }, []);

  const additionDecorations: Decoration[] = mergedAdditions.map(addition =>
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