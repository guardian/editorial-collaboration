import { css } from '@emotion/react';
import { schema } from 'prosemirror-schema-basic';
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import React, { useEffect, useRef } from 'react';

const Editor: React.FunctionComponent = () => {
  const editor = useRef<HTMLDivElement>(null);

  const style = css({
    border: '1px solid black'
  })

  useEffect(() => {
    const state = EditorState.create({schema});
    new EditorView(editor.current, {state});
  }, []);

  return (
    <div css={style} ref={editor} />
  );
};

export { Editor };