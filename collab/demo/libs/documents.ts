import { SERVER } from './constants';
import { EditorState } from 'prosemirror-state';

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

export { fetchDocuments, registerDocument };