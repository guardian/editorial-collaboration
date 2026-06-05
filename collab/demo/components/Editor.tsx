import { css } from '@emotion/react';
import { baseColors } from '@guardian/stand';
import type { FunctionComponent } from 'react';
import { useEffect, useRef } from 'react';
import { initialiseEditor } from '../libs/initialise-editor';
import type { Document } from '../model/document';

type EditorProps = {
  document: Document | undefined;
};

const EDITOR_CLASS = 'rich-text-editor';

const style = {
  placeholder: css({
    padding: '15px 10px',
    fontStyle: 'italic',
    fontSize: '1.1rem',
    color: `${baseColors.neutral['400']}`,
  }),
  editor: css({
    gridColumn: 'content-start / content-end',
    width: 'stretch',
    border: 'solid 1px black',
    [`.${EDITOR_CLASS}`]: {
      whiteSpace: 'pre-wrap',
      padding: '10px',
      ':focus-visible': {
        outline: 'none',
      },
    }
  })
}

const Editor: FunctionComponent<EditorProps> = ({
  document
}) => {
  const editorRef = useRef(null);
  const initialised = useRef(false);
  const attributes = {class: EDITOR_CLASS};

  useEffect(() => {
    if (!initialised.current && (document != null)) {
      initialised.current = true;
      const editor = initialiseEditor(document.id, editorRef.current, attributes);
      editor.focus();
    }
  }, [document, editorRef]);

  return (
    <>{(document == null) ?
      <div css={style.placeholder}>Select or create a document to start editing...</div> :
      <div css={style.editor} ref={editorRef}/>}
    </>
  );
};

export { Editor };