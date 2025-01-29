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

type Offset = {
  index: number;
  length: number;
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

const getSelections = (steps: Steps): Selection[] => {
  const selection: Selection[] = [];
  const oneMinute = 60000;
  const fiveMinutes = oneMinute * 5;
  // const oneHour = fiveMinutes * 12;
  // const oneDay = oneHour * 24;
  if (steps[0] != null) {
    let startDate = new Date(steps[0].timestamp).valueOf();
    let currentIndex = 0;
    steps.forEach((step, index) => {
      const dateToCompare = new Date(step.timestamp).valueOf();
      if (dateToCompare > startDate + fiveMinutes) {
        selection.push({ from: currentIndex, to: index });
        startDate = dateToCompare;
        currentIndex = index;
      }
    });
    selection.push({ from: currentIndex, to: steps.length + 1 })
  }
  return selection;
}

const applyOffsets = (offsets: Offset[], index: number) => {
  let newIndex = index;
  offsets.forEach(offset => {
    if (offset.index < index) {
      newIndex += offset.length;
    }
  })
  return newIndex;
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
    // Apply the steps up to the point of the start of the current history selection.
    const prevState: EditorState = EditorState.create({ doc, schema, plugins: [collab({ clientID, version })]});
    const prevSteps = data.steps.slice(0, selection.from).map(step => Step.fromJSON(schema, step.content));
    const prevTransaction = receiveTransaction(prevState, prevSteps, []);

    // Apply the new state, including the current history selection.
    const state: EditorState = EditorState.create({ doc, schema, plugins: [collab({ clientID, version })]});
    const steps = data.steps.slice(0, selection.to).map(step => Step.fromJSON(schema, step.content));
    const transaction = receiveTransaction(state, steps, []);

    // Create a changeset for the current history selection.
    const newSteps: Step[] = data.steps.slice(selection.from, selection.to).map(step => Step.fromJSON(schema, step.content));
    const newStepMaps: StepMap[] = newSteps.map(step => step.getMap());
    const changeSet = ChangeSet.create(state.doc).addSteps(state.doc, newStepMaps, {});
    const simplifiedChangeSet = simplifyChanges(changeSet.changes, changeSet.startDoc);

    const offsets: Offset[] = [];
    simplifiedChangeSet.forEach(set => {
      if (set.deleted.some(deletion => deletion.length > 0)) {
        const from = set.fromA - 2;
        const to = set.toA - 2;
        const deletedText = prevTransaction.doc.textContent.slice(from, to);
        transaction.insertText(deletedText, set.fromA);
        offsets.push({ index: from, length: deletedText.length });
      }
    });

    // Apply text decorations to insertions and deletions.
    const decorations: Decoration[] = simplifiedChangeSet.map(change => [
      Decoration.inline(applyOffsets(offsets, change.fromB), applyOffsets(offsets, change.toB), { style: 'color:#00826a;background-color:#dcf5f0;white-space:pre' }),
      Decoration.inline(change.fromA, change.toA, { style: 'color:#00826a;white-space:pre;text-decoration:line-through' })
    ]).flat();

    // Apply the changes to the editor view.
    if (steps.length > 0) {
      view?.setProps({
        state,
        attributes,
        decorations: (state: EditorState) => DecorationSet.create(state.doc, decorations)
      });
      view?.dispatch(transaction);
    }
  }

  return (
    <div css={style.container}>
      <div css={style.editor} ref={editor} />
      <div css={style.history}>{getSelections(data.steps).map((selection, index) => {
        const firstStep = data.steps[selection.from];
        if (firstStep != null) {
          const date = new Date(firstStep.timestamp);
          const hours = date.getHours();
          const minutes = date.getMinutes();
          return (
            <button key={index} css={style.button} onClick={() => onClick(selection)}>
              {`${date.getDate()} ${MONTH[date.getMonth()]}, ${hours < 10 ? `0${hours}` : hours}:${minutes < 10 ? `0${minutes}` : minutes}`}
            </button>
          );
        }
        return;
      })}</div>
    </div>
  );
};

export { Editor };