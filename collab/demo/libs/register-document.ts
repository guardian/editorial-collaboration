import type { EditorView } from 'prosemirror-view';
import { SERVER } from './constants';

const registerDocument = async (documentId: string, view: EditorView) => {
  await fetch(`${SERVER}/document/${documentId}/register`, {
    method: 'POST',
    mode: 'cors',
    credentials: 'include',
    body: JSON.stringify(view.state.doc.toJSON()),
    headers: {
      'Content-Type': 'application/json',
    }
  });
};

const getDocuments = async () =>
  await fetch(`${SERVER}/documents`, {
    method: 'GET',
    mode: 'cors',
    credentials: 'include',
  });

export { getDocuments, registerDocument };