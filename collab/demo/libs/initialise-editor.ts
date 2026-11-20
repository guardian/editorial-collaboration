import { collab, receiveTransaction } from 'prosemirror-collab';
import { baseKeymap, chainCommands, createParagraphNear, liftEmptyBlock, newlineInCode, splitBlock } from 'prosemirror-commands';
import { keymap } from 'prosemirror-keymap';
import type { EditorState, Transaction } from 'prosemirror-state';
import { Step } from 'prosemirror-transform';
import { EditorView } from 'prosemirror-view';
import { v4 as uuid } from 'uuid';
import type { Document } from '../model/document';
import type { SendableSteps } from '../model/steps';
import type { AuthenticatedUser } from '../model/user';
import { configureEditorState } from './configure-editor-state';
import { schema } from './schema';
import { StepSender } from './step-sender';

const transformSteps = (sendableSteps: SendableSteps[]): Step[] =>
  sendableSteps
    .sort((a, b) => a.version - b.version)
    .flatMap(content => content.steps.map(step => Step.fromJSON(schema, step)));

const CLIENT_ID_STORAGE_KEY = 'editorial-collaboration-client-id';
let cachedClientID: string | null = null;

const getClientID = (): string => {
  if (cachedClientID != null) {
    return cachedClientID;
  }

  if (typeof window === 'undefined') {
    cachedClientID = uuid();
    return cachedClientID;
  }

  const existingClientID = window.sessionStorage.getItem(CLIENT_ID_STORAGE_KEY);
  if (existingClientID != null && existingClientID.length > 0) {
    cachedClientID = existingClientID;
    return existingClientID;
  }

  const newClientID = uuid();
  window.sessionStorage.setItem(CLIENT_ID_STORAGE_KEY, newClientID);
  cachedClientID = newClientID;
  return newClientID;
};

const getInitialCollabVersion = (sendableSteps: SendableSteps[]): number => {
  if (sendableSteps.length === 0) {
    return 0;
  }
  return sendableSteps.reduce((minVersion, content) => Math.min(minVersion, content.version), sendableSteps[0]?.version ?? 0);
};

const insertHardBreak = (state: EditorState, dispatch?: (transaction: Transaction) => void) => {
  const hardBreak = state.schema.nodes['hard_break'];
  if (hardBreak == null) {
    return false;
  }
  if (dispatch != null) {
    dispatch(state.tr.replaceSelectionWith(hardBreak.create()).scrollIntoView());
  }
  return true;
};

const plugins = (sendableSteps: SendableSteps[] = []) => {
  const clientID = getClientID();
  const version = getInitialCollabVersion(sendableSteps);
  return [
    keymap({
      Enter: chainCommands(newlineInCode, createParagraphNear, liftEmptyBlock, splitBlock),
      'Shift-Enter': insertHardBreak,
      'Mod-Enter': insertHardBreak,
    }),
    keymap(baseKeymap),
    collab({ clientID, version }),
  ];
}

const initialiseEditor = (
  document: Document,
  place: null | ((editor: HTMLElement) => void) | {mount: HTMLElement},
  attributes: Record<string, string> | ((state: EditorState) => Record<string, string>),
  steps: SendableSteps[],
  user: AuthenticatedUser | null,
) => {
  try {
    const state = configureEditorState(plugins(steps), document.document);
    const stepSender = new StepSender(document.id, user);
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