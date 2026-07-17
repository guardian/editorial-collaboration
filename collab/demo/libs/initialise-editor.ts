import { collab, receiveTransaction } from 'prosemirror-collab';
import { schema } from 'prosemirror-schema-basic';
import type { EditorState, Transaction } from 'prosemirror-state';
import { Step } from 'prosemirror-transform';
import { EditorView } from 'prosemirror-view';
import type { Document } from '../model/document';
import type { SendableSteps } from '../model/steps';
import { configureEditorState } from './configure-editor-state';
import { StepSender } from './step-sender';

const transformSteps = (sendableSteps: SendableSteps[]): Step[] =>
  sendableSteps
    .sort((a, b) => a.version - b.version)
    .flatMap(content => content.steps.map(step => Step.fromJSON(schema, step)));

const plugins = () => {
  const clientID = 'test'; // TODO: Generate a unique client ID for each user/session
  const version = 0;
  return [collab({ clientID, version })];
}

const initialiseEditor = (
  document: Document,
  place: null | ((editor: HTMLElement) => void) | {mount: HTMLElement},
  attributes: Record<string, string> | ((state: EditorState) => Record<string, string>),
  steps: SendableSteps[],
) => {
  try {
    const state = configureEditorState(plugins(), document.document);
    const stepSender = new StepSender(document.id);
    const view = new EditorView(place, { attributes, state, dispatchTransaction: (transaction: Transaction) => {
        const newState = view.state.apply(transaction);
        view.updateState(newState);
        stepSender.sendSteps(newState);
      }});
    stepSender.setView(view);
    const transaction = receiveTransaction(state, transformSteps(steps), []);
    view.dispatch(transaction);
    return view;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export { plugins, transformSteps, initialiseEditor };