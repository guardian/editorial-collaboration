import { css } from '@emotion/react';
import { schema } from 'prosemirror-schema-basic';
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import React, { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';

const Editor: React.FunctionComponent = () => {
  const { id } = useParams();
  const editor = useRef<HTMLDivElement>(null);
  const initialised = useRef<boolean>(false);

  const style = css({
    border: '1px solid black'
  })

  useEffect(() => {
    const state = EditorState.create({schema});
    if (!initialised.current) {
      initialised.current = true;
      new EditorView(editor.current, {state});
    }
  }, []);

  return (
    <div>
      <div>{id}</div>
      <div css={style} ref={editor} />
    </div>
  );
};

export { Editor };