import { css } from '@emotion/react';
import { collab, receiveTransaction } from 'prosemirror-collab';
import { Node } from 'prosemirror-model';
import { EditorState } from 'prosemirror-state';
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

const isDeletion = (from: number, to: number): boolean => to > from

const Editor: React.FunctionComponent = () => {
  const data = useLoaderData() as { steps: Array<{ content: Content; timestamp: string }>; doc: Json };
  const clientID = 'test';
  const version = 1;
  const attributes = { contentEditable: 'false' };
  const doc = Node.fromJSON(schema, data.doc);
  const initialState = EditorState.create({ doc, schema, plugins: [collab({ clientID, version })]});
  const editor = useRef<HTMLDivElement>(null);
  const initialised = useRef<boolean>(false);
  const [view, setView] = useState<EditorView>();

  useEffect(() => {
    if (!initialised.current) {
      initialised.current = true;
      const view = new EditorView(editor.current, { state: initialState, attributes });
      setView(view);
      data.steps.forEach(step => console.log(JSON.stringify(step)));
      const steps = data.steps.map(step => Step.fromJSON(schema, step.content));
      const transaction = receiveTransaction(initialState, steps, []);
      view.dispatch(transaction);
    }
  }, []);

  const onClick = (index: number, content: Content) => {
    const { from, to } = content;
    const deleting = isDeletion(from, to);
    const decorations: Decoration[] = deleting ?
      [Decoration.inline(from, to + 2, { style: 'color:#00826a;white-space:pre;text-decoration:line-through' })] :
      [Decoration.inline(from, to + 2, { style: 'color:#00826a;background-color:#dcf5f0;white-space:pre' })];
    view?.setProps({
      state: initialState,
      attributes,
      decorations: (state: EditorState) => DecorationSet.create(state.doc, decorations)
    });
    const stepsToApply = data.steps.slice(0, deleting ? index + 1 + (from - to) : index + 1);
    const steps = stepsToApply.map(step => Step.fromJSON(schema, step.content));
    const transaction = receiveTransaction(initialState, steps, []);
    view?.dispatch(transaction);
  }

  return (
    <div css={style.container}>
      <div css={style.editor} ref={editor} />
      <div css={style.history}>{data.steps.map((step, index) => {
        const date = new Date(step.timestamp);
        const dateString = `${date.getDay()} ${MONTH[date.getMonth() - 1]}, ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
        return (
          <button key={index} css={style.button} onClick={() => onClick(index, step.content)}>
            {`${dateString} - ${JSON.stringify(step.content.slice?.content)}`}
          </button>
        );
      })}</div>
    </div>
  );
};

export { Editor };