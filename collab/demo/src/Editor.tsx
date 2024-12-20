import { css } from '@emotion/react';
import { collab, receiveTransaction } from 'prosemirror-collab';
import { Node } from 'prosemirror-model';
import { EditorState } from 'prosemirror-state';
import { Step } from 'prosemirror-transform';
import { EditorView } from 'prosemirror-view';
import React, { useEffect, useRef } from 'react';
import { useLoaderData } from 'react-router-dom';
import type { Json } from "../../src/types/json";
import { schema } from '../lib/create-schema';
import { MONTH } from '../lib/month';

type Content = {
  slice?: {
    content: any;
  }
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
  }),
  button: css({
    width: 'fit-content',
  })
}

const Editor: React.FunctionComponent = () => {
  const data = useLoaderData() as { steps: Array<{ content: Content, timestamp: string }>; doc: Json };
  const editor = useRef<HTMLDivElement>(null);
  const initialised = useRef<boolean>(false);

  useEffect(() => {
    if (!initialised.current) {
      initialised.current = true;
      const clientID = 'test';
      const version = 1;
      const doc = Node.fromJSON(schema, data.doc);
      const state = EditorState.create({ doc, schema, plugins: [collab({ clientID, version })]});
      const view = new EditorView(editor.current, {state, attributes: { contentEditable: 'false' }});
      const steps = data.steps.map(step => Step.fromJSON(schema, step.content));
      const transaction = receiveTransaction(state, steps, []);
      view.dispatch(transaction);
    }
  }, []);

  return (
    <div css={style.container}>
      <div css={style.editor} ref={editor} />
      <div css={style.history}>{data.steps.map(step => {
        const date = new Date(step.timestamp);
        const dateString = `${date.getDay()} ${MONTH[date.getMonth() - 1]}, ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
        return (<button css={style.button}>{`${dateString} - ${JSON.stringify(step.content.slice?.content)}`}</button>)
      })}</div>
    </div>
  );
};

export { Editor };