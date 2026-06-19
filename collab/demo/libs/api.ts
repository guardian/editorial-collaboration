import type { EditorState } from 'prosemirror-state';
import type { SendableSteps } from '../model/sendable-steps';
import { SERVER } from './constants';

const registerDocument = async (documentId: string, state: EditorState) =>
  await fetch(`${SERVER}/document/${documentId}/register`, {
    method: 'POST',
    mode: 'cors',
    credentials: 'include',
    body: JSON.stringify(state.doc.toJSON()),
    headers: {
      'Content-Type': 'application/json',
    }
  });

const fetchDocuments = async () =>
  await fetch(`${SERVER}/documents`, {
    method: 'GET',
    mode: 'cors',
    credentials: 'include',
  });

const fetchSteps = async (documentId: string) =>
  await fetch(`${SERVER}/document/${documentId}/steps`, {
    method: 'GET',
    mode: 'cors',
    credentials: 'include',
  });

const sendStepsToServer = async (documentId: string, stepsToSend: SendableSteps[]) =>
  await fetch(`${SERVER}/document/${documentId}/steps`, {
    method: 'POST',
    mode: 'cors',
    credentials: 'include',
    headers: new Headers({
      "Content-Type": "application/json"
    }),
    body: JSON.stringify(stepsToSend)
  });

export {
  fetchDocuments,
  registerDocument,
  fetchSteps,
  sendStepsToServer,
};