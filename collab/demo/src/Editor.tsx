import { css } from '@emotion/react';
import { ChangeSet, simplifyChanges } from 'prosemirror-changeset';
import { collab, receiveTransaction } from 'prosemirror-collab';
import { Node } from 'prosemirror-model';
import { EditorState } from 'prosemirror-state';
import type { StepMap } from 'prosemirror-transform';
import { Step } from 'prosemirror-transform';
import { Decoration, DecorationSet, EditorView } from 'prosemirror-view';
import React, { useEffect, useRef, useState } from 'react';
import { useLoaderData } from 'react-router-dom';
import type { Json } from "../../src/types/json";
import { schema } from '../lib/create-schema';
import { MONTH } from '../lib/month';

type Content = {
  slice?: {
    content: unknown;
  };
  to: number;
  from: number;
}

type Steps = Array<{ content: Content; timestamp: string }>;

type Selection = {
  from: number;
  to: number;
}

const style = {
  container: css({
    display: 'flex',
    gap: '10px',
  }),
  editor: css({
    border: '1px solid black',
    padding: '0 10px',
    flexGrow: 3,
  }),
  history: css({
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
    height: '400px',
    overflowY: 'scroll',
  }),
  button: css({
    width: 'fit-content',
  })
}

const groupSteps = (steps: Steps): Selection[] => {
  const length = steps.length;
  return [
    { from: 0, to: Math.floor(length / 2) },
    { from: Math.floor(length / 2), to: length + 1 }
  ];
}

const Editor: React.FunctionComponent = () => {
  const data = useLoaderData() as { steps: Steps; doc: Json };
  const clientID = 'test';
  const version = 1;
  const attributes = { contentEditable: 'false' };
  const doc = Node.fromJSON(schema, data.doc);
  const editor = useRef<HTMLDivElement>(null);
  const initialised = useRef<boolean>(false);
  const [view, setView] = useState<EditorView>();

  useEffect(() => {
    if (!initialised.current) {
      initialised.current = true;
      const state = EditorState.create({ doc, schema, plugins: [collab({ clientID, version })]});
      const view = new EditorView(editor.current, { state, attributes });
      setView(view);
      const steps = data.steps.map(step => Step.fromJSON(schema, step.content));
      const transaction = receiveTransaction(state, steps, []);
      view.dispatch(transaction);
    }
  }, []);

  const onClick = (selection: Selection) => {
    // Reset the editor state
    const state: EditorState = EditorState.create({ doc, schema, plugins: [collab({ clientID, version })]});

    // Generate a simplified changeset grouping steps into insertions and deletions.
    const steps: Step[] = data.steps.slice(selection.from, selection.to).map(step => Step.fromJSON(schema, step.content));
    const stepMaps: StepMap[] = steps.map(step => step.getMap());
    const changeSet = ChangeSet.create(state.doc).addSteps(state.doc, stepMaps, data);
    const simplifiedChangeSet = simplifyChanges(changeSet.changes, changeSet.startDoc);

    // Apply text decorations to insertions and deletions.
    const decorations: Decoration[] = simplifiedChangeSet.map(change => [
      Decoration.inline(change.fromB, change.toB, { style: 'color:#00826a;background-color:#dcf5f0;white-space:pre' }),
      Decoration.inline(change.fromA, change.toA, { style: 'color:#00826a;white-space:pre;text-decoration:line-through' })
    ]).flat();

    // Apply the changes to the editor view.
    view?.setProps({
      state,
      attributes,
      decorations: (state: EditorState) => DecorationSet.create(state.doc, decorations)
    });
    const stepsToApply = data.steps.slice(0, selection.to).map(step => Step.fromJSON(schema, step.content));
    const transaction = receiveTransaction(state, stepsToApply, []);
    view?.dispatch(transaction);
  }

  return (
    <div css={style.container}>
      <div css={style.editor} ref={editor} />
      <div css={style.history}>{groupSteps(data.steps).map((selection, index) => {
        const firstStep = data.steps[selection.from];
        if (firstStep != null) {
          const date = new Date(firstStep.timestamp);
          return (
            <button key={index} css={style.button} onClick={() => onClick(selection)}>
              {`${date.getDate()} ${MONTH[date.getMonth()]}, ${date.getHours()}:${date.getMinutes()}`}
            </button>
          );
        }
        return;
      })}</div>
    </div>
  );
};

export { Editor };