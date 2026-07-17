import { css } from '@emotion/react';
import { baseColors } from '@guardian/stand';
import { receiveTransaction } from 'prosemirror-collab';
import type { EditorView } from 'prosemirror-view';
import type { FunctionComponent } from 'react';
import { useEffect , useRef, useState } from 'react';
import { configureEditorState } from '../libs/configure-editor-state';
import { initialiseEditor, plugins, transformSteps } from '../libs/initialise-editor';
import type { Document } from '../model/document';
import type { SendableSteps, StepSelection } from '../model/steps';

type EditorProps = {
  document: Document | null;
  steps: SendableSteps[];
  stepSelection: StepSelection | null;
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
const attributes = (selection: StepSelection | null) => selection == null ? baselineAttributes : readOnlyAttributes

const Editor: FunctionComponent<EditorProps> = ({
  document,
  steps,
  stepSelection,
}) => {
  const [editorView, setEditorView] = useState<EditorView | null>(null);
  const editorRef = useRef(null);
  const documentIdRef = useRef<string>(null);

  // initialise the editor exactly once whenever the document changes.
  useEffect(() => {
    if (document != null && documentIdRef.current !== document.id) {
      documentIdRef.current = document.id;
      editorView?.destroy();
      const newEditorView = initialiseEditor(document, editorRef.current, attributes(stepSelection), steps);
      setEditorView(newEditorView);
      newEditorView?.focus();
    }
  }, [editorView, document, stepSelection]);

  // update editor state when step selection changes.
  useEffect(() => {
    if (
      document != null &&
      stepSelection != null &&
      editorView?.isDestroyed === false
    ) {
      const newState = configureEditorState(plugins(), document.document);
      const transaction = receiveTransaction(newState, transformSteps(steps.slice(0, stepSelection.to + 1)), []);
      editorView.setProps({
        state: newState,
        attributes: attributes(stepSelection)
      });
      editorView.dispatch(transaction);
    }
  }, [editorView, document, stepSelection]);

  return (
    <>{(document == null) ?
      <div css={style.placeholder}>Select or create a document to start editing...</div> :
      <div css={[style.editor, stepSelection != null && style.preview]} ref={editorRef}/>}
    </>
  );
};

export { Editor };