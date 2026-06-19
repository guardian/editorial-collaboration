import { css } from '@emotion/react';
import { baseColors } from '@guardian/stand';
import type { EditorView } from 'prosemirror-view';
import type { FunctionComponent} from 'react';
import { useEffect , useRef, useState } from 'react';
import { initialiseEditor } from '../libs/initialise-editor';
import type { Document } from '../model/document';
import type { SendableSteps } from '../model/steps';

type EditorProps = {
  document: Document | undefined;
  steps: SendableSteps[];
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
  document,
  steps,
}) => {
  const [editor, setEditor] = useState<EditorView | undefined>(undefined);
  const editorRef = useRef(null);
  const initialised = useRef<string>(null);

  useEffect(() => {
    if ((document != null) && initialised.current !== document.id) {
      editor?.destroy();
      initialised.current = document.id;
      const newEditor = initialiseEditor(document, steps, editorRef.current, attributes);
      if (newEditor != null) {
        setEditor(newEditor);
      }
      newEditor?.focus();
    }
  }, [document, editor, editorRef, steps]);

  return (
    <>{(document == null) ?
      <div css={style.placeholder}>Select or create a document to start editing...</div> :
      <div css={style.editor} ref={editorRef}/>}
    </>
  );
};

export { Editor };