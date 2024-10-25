import { css } from '@emotion/react';
import { collab } from 'prosemirror-collab';
import { schema } from 'prosemirror-schema-basic';
// import type { Transaction } from 'prosemirror-state';
import { EditorState } from 'prosemirror-state';
// import { Step } from 'prosemirror-transform';
import { EditorView } from 'prosemirror-view';
import React, { useEffect, useRef } from 'react';
import { useLoaderData } from 'react-router-dom';


const Editor: React.FunctionComponent = () => {
  const data = useLoaderData();
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
      const state = EditorState.create({schema, plugins: [collab({ clientID, version })]});
      new EditorView(editor.current, {state});
      // const steps = data.map(step => Step.fromJSON(schema, step.content));
      // const transaction: Transaction = receiveTransaction(state, steps, []);
      // view.dispatch(transaction);
    }
  }, []);

  return (
    <div>
      {JSON.stringify(data)}
      <div css={style} ref={editor} />
    </div>
  );
};

export { Editor };