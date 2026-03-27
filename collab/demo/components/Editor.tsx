import { css } from '@emotion/react';
import { useEffect, useRef, useState } from 'react';
import { v4 } from 'uuid';
import { initialiseEditor } from '../libs/initialise-editor';
import { registerDocument } from '../libs/register-document';

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
  const [documentId] = useState(() => v4());

  useEffect(() => {
    if (!initialised.current) {
      initialised.current = true;
      const editor = initialiseEditor(editorRef.current, attributes, documentId);
      editor.focus();
      registerDocument(documentId, editor)
        .catch(err => console.error(err)); // TODO: logging/alerting
    }
  }, [documentId]);

  return (
    <div css={style} ref={editorRef} />
  );
};

export { Editor }