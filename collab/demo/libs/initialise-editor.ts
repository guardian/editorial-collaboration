import { collab, receiveTransaction } from 'prosemirror-collab';
import { schema } from 'prosemirror-schema-basic';
import type { Transaction } from 'prosemirror-state';
import { EditorState } from 'prosemirror-state';
import { Step } from 'prosemirror-transform';
import { EditorView } from 'prosemirror-view';
import { z } from 'zod';
import type { Document } from '../model/document';
import { sendableSteps } from '../model/sendableSteps';
import { StepSender } from './step-sender';
import { fetchSteps } from './steps';

const initialiseEditor = async (
  document: Document,
  place: null | ((editor: HTMLElement) => void) | {mount: HTMLElement},
  attributes: Record<string, string> | ((state: EditorState) => Record<string, string>),
) => {
  const clientID = 'test'; // TODO: Generate a unique client ID for each user/session
  const version = 0;
  const plugins = [collab({ clientID, version })];
  try {
    const doc = schema.nodeFromJSON(document.document);
    const state = EditorState.create({ doc, schema, plugins });
    const stepSender = new StepSender(document.id);
    const view = new EditorView(place, { attributes, state, dispatchTransaction: (transaction: Transaction) => {
        const newState = view.state.apply(transaction);
        view.updateState(newState);
        stepSender.sendSteps(newState);
      }});
    stepSender.setView(view);
    await fetchSteps(document.id)
      .then(response => response.json())
      .then(json => z.array(sendableSteps).parse(json)
        .map(sendableSteps => sendableSteps.content)
        .sort((a, b) => a.version - b.version))
      .then(content => content.flatMap(content => content.steps as unknown))
      .then(steps => {
        const transaction = receiveTransaction(view.state, steps.map(step => Step.fromJSON(schema, step)), []);
        view.dispatch(transaction);
      }).catch(err => console.error(err));
    // TODO if there are steps and we fail to apply them, we should prevent the editor from being initialised and show
    //  an error message to the user. This prevents steps from being lost and the document from being corrupted.
    return view;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export { initialiseEditor };