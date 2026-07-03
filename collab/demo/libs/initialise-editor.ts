import { collab, receiveTransaction } from 'prosemirror-collab';
import { schema } from 'prosemirror-schema-basic';
import type { EditorState, Transaction } from 'prosemirror-state';
import { Step } from 'prosemirror-transform';
import { EditorView } from 'prosemirror-view';
import type { Document } from '../model/document';
import type { SendableSteps } from '../model/steps';
import { configureEditorState } from './configure-editor-state';
import { StepSender } from './step-sender';

const initialiseEditor = (
  document: Document,
  steps: SendableSteps[],
  place: null | ((editor: HTMLElement) => void) | {mount: HTMLElement},
  attributes: Record<string, string> | ((state: EditorState) => Record<string, string>),
) => {
  const clientID = 'test'; // TODO: Generate a unique client ID for each user/session
  const version = 0;
  const plugins = [collab({ clientID, version })];
  try {
    const state = configureEditorState(plugins, document.document);
    const stepSender = new StepSender(document.id);
    const view = new EditorView(place, { attributes, state, dispatchTransaction: (transaction: Transaction) => {
        const newState = view.state.apply(transaction);
        view.updateState(newState);
        stepSender.sendSteps(newState);
      }});
    stepSender.setView(view);
    const stepsToApply = steps
      .sort((a, b) => a.version - b.version)
      .flatMap(content => content.steps.map(step => Step.fromJSON(schema, step)));
    const transaction = receiveTransaction(view.state, stepsToApply, []);
    view.dispatch(transaction);
    // TODO if there are steps and we fail to apply them, we should prevent the editor from being initialised and show
    //  an error message to the user. This prevents steps from being lost and the document from being corrupted.
    return view;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export { initialiseEditor };