import { collab } from 'prosemirror-collab';
import { schema } from 'prosemirror-schema-basic';
import type { Transaction } from 'prosemirror-state';
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import type { DOMNode } from 'prosemirror-view/src/dom';
import { StepSender } from "./step-sender";

const initialiseEditor = (
  place: null | DOMNode | ((editor: HTMLElement) => void) | {mount: HTMLElement},
  attributes: Record<string, string> | ((state: EditorState) => Record<string, string>),
  documentId: string,
) => {
  const plugins = [collab()];
  const state = EditorState.create({ schema, plugins });
  const stepSender = new StepSender(documentId);
  const view = new EditorView(place, { attributes, state, dispatchTransaction: (transaction: Transaction) => {
      const newState = view.state.apply(transaction);
      view.updateState(newState);
      stepSender.sendSteps(newState);
    }});
  stepSender.setView(view);
  return view;
};

export { initialiseEditor };