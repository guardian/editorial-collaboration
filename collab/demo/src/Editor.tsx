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

const Editor: React.FunctionComponent = () => {
  const data = useLoaderData() as { steps: Array<{ content: Json}>; doc: Json };
  const editor = useRef<HTMLDivElement>(null);
  const initialised = useRef<boolean>(false);

  const style = css({
    border: '1px solid black'
  })

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
    <div>
      <div css={style} ref={editor} />
    </div>
  );
};

export { Editor };