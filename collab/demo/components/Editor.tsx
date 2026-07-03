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
  editing: boolean;
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
  }),
  preview: css({
    color: baseColors.neutral['200'],
  })
}

const baselineAttributes = { class: EDITOR_CLASS };
const readOnlyAttributes = { ...baselineAttributes, contentEditable: 'false' };

const Editor: FunctionComponent<EditorProps> = ({
  document,
  steps,
  editing,
}) => {
  const [editor, setEditor] = useState<EditorView | undefined>(undefined);
  const editorRef = useRef(null);
  const idRef = useRef<string>();
  const stepsRef = useRef<number>();
  const editingRef = useRef<boolean>();

  useEffect(() => {
    if ((document != null) && (
      idRef.current !== document.id ||
      stepsRef.current !== steps.length ||
      editingRef.current !== editing
    )) {
      editor?.destroy();
      idRef.current = document.id;
      stepsRef.current = steps.length;
      editingRef.current = editing;
      const attributes = editing ? baselineAttributes : readOnlyAttributes;
      const newEditor = initialiseEditor(document, steps, editorRef.current, attributes);
      if (newEditor != null) {
        setEditor(newEditor);
      }
      newEditor?.focus();
    }
  }, [document, editor, editing, steps]);

  return (
    <>{(document == null) ?
      <div css={style.placeholder}>Select or create a document to start editing...</div> :
      <div css={[style.editor, !editing && style.preview]} ref={editorRef}/>}
    </>
  );
};

export { Editor };