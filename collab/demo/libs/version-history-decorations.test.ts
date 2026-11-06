import { schema } from 'prosemirror-schema-basic';
import { Step } from 'prosemirror-transform';
import { getVersionHistoryDecorationRanges } from './version-history-decorations';

type Spec = {
  changeType: 'addition' | 'deletion';
  deletedText?: string;
}

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
    const steps = [
      Step.fromJSON(schema, {
        stepType: 'replace',
        from: 1,
        to: 1,
        slice: { content: [{ type: 'text', text: 'cat' }] }
      }),
      Step.fromJSON(schema, {
        stepType: 'replace',
        from: 4,
        to: 4,
        slice: { content: [{ type: 'text', text: 's' }] }
      })
    ];
    const decorations = getVersionHistoryDecorationRanges(startingDoc, steps, { from: 0, to: 1 });
    expect(decorations.success).toBe(true);
    if (!decorations.success) {
      throw new Error('Expected success result');
    }
    expect(decorations.data).toHaveLength(1);
    const addition = decorations.data[0];
    const spec = addition?.spec as Spec | undefined;
    expect(addition?.from).toBe(1);
    expect(addition?.to).toBe(4);
    expect(spec?.changeType).toBe('addition');
  });

  it('returns deletions for deleted text', () => {
    const steps = [
      Step.fromJSON(schema, {
        stepType: 'replace',
        from: 1,
        to: 1,
        slice: { content: [{ type: 'text', text: 'cat' }] }
      }),
      Step.fromJSON(schema, {
        stepType: 'replace',
        from: 2,
        to: 3
      })
    ];

    const decorations = getVersionHistoryDecorationRanges(startingDoc, steps, { from: 1, to: 2 });
    expect(decorations.success).toBe(true);
    if (!decorations.success) {
      throw new Error('Expected success result');
    }
    const deletionDecoration = decorations.data.find(decoration => {
      const spec = decoration.spec as Spec;
      return spec.changeType === 'deletion'
    });
    expect(deletionDecoration).toBeDefined();
    expect(deletionDecoration?.from).toBe(2);
    const spec = deletionDecoration?.spec as Spec | undefined;
    expect(spec?.deletedText).toBe('a');
  });

  it('returns addition and deletion decorations for same-length replacement', () => {
    const steps = [
      Step.fromJSON(schema, {
        stepType: 'replace',
        from: 1,
        to: 1,
        slice: { content: [{ type: 'text', text: 'cat' }] }
      }),
      Step.fromJSON(schema, {
        stepType: 'replace',
        from: 2,
        to: 3,
        slice: { content: [{ type: 'text', text: 'o' }] }
      })
    ];

    const decorations = getVersionHistoryDecorationRanges(startingDoc, steps, { from: 1, to: 2 });
    expect(decorations.success).toBe(true);
    if (!decorations.success) {
      throw new Error('Expected success result');
    }

    const additionDecoration = decorations.data.find(decoration => {
      const spec = decoration.spec as Spec;
      return spec.changeType === 'addition';
    });
    expect(additionDecoration).toBeDefined();
    expect(additionDecoration?.from).toBe(2);
    expect(additionDecoration?.to).toBe(3);

    const deletionDecoration = decorations.data.find(decoration => {
      const spec = decoration.spec as Spec;
      return spec.changeType === 'deletion';
    });
    expect(deletionDecoration).toBeDefined();
    const spec = deletionDecoration?.spec as Spec | undefined;
    expect(spec?.deletedText).toBe('a');
  });

  it('returns no decorations when additions and deletions result in no net text change', () => {
    const steps = [
      Step.fromJSON(schema, {
        stepType: 'replace',
        from: 1,
        to: 1,
        slice: { content: [{ type: 'text', text: 'cat' }] }
      }),
      Step.fromJSON(schema, {
        stepType: 'replace',
        from: 1,
        to: 4
      })
    ];

    const decorations = getVersionHistoryDecorationRanges(startingDoc, steps, { from: 0, to: 2 });
    expect(decorations.success).toBe(true);
    if (!decorations.success) {
      throw new Error('Expected success result');
    }
    expect(decorations.data).toEqual([]);
  });

  it('filters deletions that remove content added within the selected step range', () => {
    const steps = [
      Step.fromJSON(schema, {
        stepType: 'replace',
        from: 1,
        to: 1,
        slice: { content: [{ type: 'text', text: 'cat' }] }
      }),
      Step.fromJSON(schema, {
        stepType: 'replace',
        from: 2,
        to: 3
      })
    ];

    const decorations = getVersionHistoryDecorationRanges(startingDoc, steps, { from: 0, to: 2 });
    expect(decorations.success).toBe(true);
    if (!decorations.success) {
      throw new Error('Expected success result');
    }

    const additionDecoration = decorations.data.find(decoration => {
      const spec = decoration.spec as Spec;
      return spec.changeType === 'addition';
    });
    expect(additionDecoration).toBeDefined();
    expect(additionDecoration?.from).toBe(1);
    expect(additionDecoration?.to).toBe(3);

    const deletionDecoration = decorations.data.find(decoration => {
      const spec = decoration.spec as Spec;
      return spec.changeType === 'deletion';
    });
    expect(deletionDecoration).toBeUndefined();
  });
});
