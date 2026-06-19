import { css } from '@emotion/react';
import { baseColors } from '@guardian/stand';
import type { EditorView } from 'prosemirror-view';
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
    [`.${EDITOR_CLASS}`]: {
      whiteSpace: 'pre-wrap',
      padding: '10px',
      ':focus-visible': {
        outline: 'none',
      },
    }
  })
}

const attributes = { class: EDITOR_CLASS };

const Editor: FunctionComponent<EditorProps> = ({
  document
}) => {
  const editor = useRef<EditorView>(null);
  const editorRef = useRef(null);
  const initialised = useRef<string>(null);

  useEffect(() => {
    if ((document != null) && initialised.current !== document.id) {
      editor.current?.destroy();
      initialised.current = document.id;
      void initialiseEditor(document, editorRef.current, attributes)
        .then(newEditor => {
          editor.current = newEditor;
          newEditor?.focus();
        });
    }
  }, [document, editor, editorRef]);

  return (
    <>{(document == null) ?
      <div css={style.placeholder}>Select or create a document to start editing...</div> :
      <div css={style.editor} ref={editorRef}/>}
    </>
  );
};

export { Editor };