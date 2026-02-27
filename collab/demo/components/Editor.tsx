import { useEffect, useRef } from 'react';
import { schema } from 'prosemirror-schema-basic';
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { css } from '@emotion/react';

const EDITOR_CLASS = 'rich-text-editor';

const style = css({
  border: 'solid 1px black',
  [`.${EDITOR_CLASS}`]: {
    padding: '10px',
    ':focus-visible': {
      outline: 'none',
    },
  }
});

const Editor = () => {
  const editorRef = useRef(null);
  const initialised = useRef(false);
  const attributes = { class: EDITOR_CLASS };

  useEffect(() => {
    if (!initialised.current) {
      initialised.current = true;
      const state = EditorState.create({schema});
      const editor = new EditorView(editorRef.current, {state, attributes});
      editor.focus();
    }
  }, []);

  return (
    <div css={style} ref={editorRef} />
  );
};

export { Editor }