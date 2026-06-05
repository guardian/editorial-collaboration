import { collab } from 'prosemirror-collab';
import { schema } from 'prosemirror-schema-basic';
import type { Transaction } from 'prosemirror-state';
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { StepSender } from './step-sender';
import { Document } from '../model/document';

const initialiseEditor = (
  document: Document,
  place: null | ((editor: HTMLElement) => void) | {mount: HTMLElement},
  attributes: Record<string, string> | ((state: EditorState) => Record<string, string>),
) => {
  const plugins = [collab()];
  try {
    const doc = schema.nodeFromJSON(document.document);
    const state = EditorState.create({ doc, schema, plugins });
    const stepSender = new StepSender(document.id);
    const view = new EditorView(place, { attributes, state, dispatchTransaction: (transaction: Transaction) => {
        const newState = view.state.apply(transaction);
        view.updateState(newState);
        stepSender.sendSteps(newState)
          .catch(err => console.error(err));
      }});
    stepSender.setView(view);
    return view;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export { initialiseEditor };