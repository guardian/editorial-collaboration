import { css } from '@emotion/react';
import { useEffect, useRef } from 'react';
import { initialiseEditor } from '../libs/initialise-editor';

const EDITOR_CLASS = 'rich-text-editor';

const style = css({
  border: 'solid 1px black',
  [`.${EDITOR_CLASS}`]: {
    whiteSpace: 'pre-wrap',
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
      const editor = initialiseEditor(editorRef.current, attributes);
      editor.focus();
    }
  }, []);

  return (
    <div css={style} ref={editorRef} />
  );
};

export { Editor }