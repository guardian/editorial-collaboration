import { css } from '@emotion/react';
import { baseColors } from '@guardian/stand';
import { Button } from '@guardian/stand/button';
import { receiveTransaction } from 'prosemirror-collab';
import type { EditorState } from 'prosemirror-state';
import type { EditorView } from 'prosemirror-view';
import { DecorationSet } from 'prosemirror-view';
import type { FunctionComponent } from 'react';
import { useCallback , useEffect , useRef, useState } from 'react';
import { v4 } from 'uuid';
import { registerDocument } from '../libs/api';
import { configureEditorState } from '../libs/configure-editor-state';
import { initialiseEditor, plugins, transformSteps } from '../libs/initialise-editor';
import { getVersionHistoryDecorationRanges } from '../libs/version-history-decorations';
import type { Document} from '../model/document';
import { document } from '../model/document';
import type { SendableSteps, StepSelection } from '../model/steps';
import { panel } from '../styles';

type EditorProps = {
  currentDocument: Document | null;
  closeEditor: () => void;
  createNewDocument: (document: Document) => void;
  setError: (error: string) => void;
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
      '.version-history-addition': {
        color: '#00826a',
        backgroundColor: '#dcf5f0',
      },
      '.version-history-deletion': {
        color: '#00826a',
        backgroundColor: '#dcf5f0',
        textDecoration: 'line-through'
      }
    }
  }),
  footer: css({
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: `${baseColors.neutral['850']}`,
    padding: 4,
  }),
  preview: css({
    color: baseColors.neutral['200'],
  })
}

const baselineAttributes = { class: EDITOR_CLASS, contentEditable: 'true' };
const readOnlyAttributes = { ...baselineAttributes, contentEditable: 'false' };
const attributes = (selection: StepSelection | null) => selection == null ? baselineAttributes : readOnlyAttributes

const Editor: FunctionComponent<EditorProps> = ({
  currentDocument,
  closeEditor,
  createNewDocument,
  setError,
  steps,
  stepSelection,
}) => {
  const [pending, setPending] = useState<boolean>(false);
  const [editorView, setEditorView] = useState<EditorView | null>(null);
  const editorRef = useRef(null);
  const documentIdRef = useRef<string>(null);

  // initialise the editor exactly once whenever the document changes.
  useEffect(() => {
    if (currentDocument != null && documentIdRef.current !== currentDocument.id) {
      documentIdRef.current = currentDocument.id;
      editorView?.destroy();
      const newEditorView = initialiseEditor(currentDocument, editorRef.current, attributes(stepSelection), steps);
      setEditorView(newEditorView);
      newEditorView?.focus();
    }
  }, [editorView, currentDocument, stepSelection]);

  // update editor state when step selection changes.
  useEffect(() => {
    if (
      currentDocument != null &&
      editorView?.isDestroyed === false
    ) {
      const stepsToApply = (stepSelection != null) ? steps.slice(0, stepSelection.to) : steps;
      const state = configureEditorState(plugins(stepsToApply), currentDocument.document);
      const transaction = receiveTransaction(state, transformSteps(stepsToApply), []);
      state.apply(transaction);
      const ranges = (stepSelection != null) ? getVersionHistoryDecorationRanges(state.doc, transformSteps(steps), stepSelection) : { success: false, data: [] };
      const decorations = ranges.success ? ranges.data : [];
      editorView.setProps({
        state,
        attributes: attributes(stepSelection),
        decorations: (state: EditorState) => DecorationSet.create(state.doc, decorations)
      });
      editorView.dispatch(transaction);
    }
  }, [editorView, currentDocument, stepSelection]);

  const onClickCreateDocument = useCallback(() => {
    setPending(true);
    const id = v4();
    const state = configureEditorState();
    void registerDocument(id, state)
      .then(response => response.json())
      .then(json => {
        const newDocument = document.parse(json);
        createNewDocument(newDocument);
      })
      .catch(() => setError('Failed to create new document'))
      .finally(() => setPending(false));
  }, []);

  const onClickCloseEditor = useCallback(() => {
    documentIdRef.current = null;
    closeEditor();
  }, []);

  return (
    <>{(currentDocument == null) ?
        <div css={style.placeholder}>Select or create a document to start editing...</div> :
        <div css={[style.editor, stepSelection != null && style.preview]} ref={editorRef}/>
      }
        <div css={style.footer}>
          {(currentDocument == null) ?
            <Button isDisabled={pending} cssOverrides={panel.button} onClick={onClickCreateDocument}>Create New Document</Button> :
            <Button cssOverrides={panel.button} onClick={onClickCloseEditor}>Close Editor</Button>
          }
        </div>
    </>
  );
};

export { Editor };