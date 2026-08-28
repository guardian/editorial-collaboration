import { schema } from 'prosemirror-schema-basic';
import type { Step } from 'prosemirror-transform';
import { STEPS_FIXTURE } from '../fixtures/steps-fixture';
import { getVersionHistoryDecorationRanges } from './version-history-decorations';

const startingDoc = schema.nodeFromJSON({
  type: 'doc',
  content: [
    {
      type: 'paragraph'
    }
  ]
});

describe('getVersionHistoryDecorations', () => {
  it('fails when step selection to index is greater than step length', () => {
    const steps: Step[] = []
    const stepSelection = {from: 1, to: 2};
    const decorations = getVersionHistoryDecorationRanges(startingDoc, steps, stepSelection);
    expect(decorations.success).toBe(false);
    expect(decorations.failure).toBe(`Step selection to index ${stepSelection.to} is greater than the number of steps ${steps.length}`);
  });

  it('returns a decoration range for text addition', () => {
    const decorations = getVersionHistoryDecorationRanges(startingDoc, STEPS_FIXTURE, { from: 0, to: 2 });
    expect(decorations.success).toBe(true);
    expect(decorations.data).toEqual([
      {
        from: 1,
        to: 3,
        type: {
          attrs: {
            class: 'version-history-addition'
          },
          spec: {}
        }
      }
    ]);
  });

  it('returns a decoration range for text addition that is not at the start of the document', () => {
    const decorations = getVersionHistoryDecorationRanges(startingDoc, STEPS_FIXTURE, { from: 183, to: 184 });
    expect(decorations.success).toBe(true);
    expect(decorations.data).toEqual([]);
  });

  it('returns a decoration range for deleted content', () => {

  });

  it.todo('creates a combined decoration set for multiple step batches');

  it.todo('provides reusable builders for future step-based scenarios');
});

