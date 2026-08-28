import { ChangeSet } from 'prosemirror-changeset';
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
const getVersionHistoryDecorationRanges = (doc: Node, steps: Step[], stepSelection: StepSelection): Result<Decoration[]> => {
  if (stepSelection.from < 0 || stepSelection.to > steps.length) {
    return failWith(`Step selection to index ${stepSelection.to} is greater than the number of steps ${steps.length}`);
  }
  const newSteps = steps.slice(stepSelection.from, stepSelection.to);

  const changeSet = ChangeSet.create(doc).addSteps(doc, newSteps.map(step => step.getMap()), []);
  const changes = changeSet.changes;

  if (changes.length == 0 && hasReplacement(newSteps)) {
    console.log('this is an edge case awaiting implementation');
  }

  console.log(changes)

  const decorations = changes.map(change => {
    const dec: Decoration[] = [];
    if (change.toB > change.fromB) {
      dec.push(Decoration.inline(change.fromB, change.toB, { class: 'version-history-addition' }));
    }
    if (change.toA > change.fromA) {
      dec.push(Decoration.inline(change.fromB, change.toB, { class: 'version-history-deletion' }));
    }
    return dec;
  }).filter(Boolean).flat();
  return succeedWith(decorations);
};

// In the scenario where text is replaced with different text of the same length, the changeset library will return an
// empty changeset. We still want to represent these changes as an insertion and deletion, so we check for them manually.
const hasReplacement = (steps: Step[]) =>
  steps.some(step => {
    let result = false;
    step.getMap().forEach((fromA, toA, fromB, toB) => {
      if (fromA < toA && fromB < toB && fromA == fromB && toA == toB) {
        result = true;
      }
    });
    return result;
  });

export { getVersionHistoryDecorationRanges };


// console.log(`fromA: ${fromA}, toA: ${toA}, fromB: ${fromB}, toB ${toB}`);