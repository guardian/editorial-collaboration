import type { EditorView } from 'prosemirror-view';
import { server } from './constants';

const registerDocument = async (documentId: string, view: EditorView) => {
  await fetch(`${server}/document/${documentId}/register`, {
    method: 'POST',
    mode: 'cors',
    credentials: 'include',
    body: JSON.stringify(view.state.doc.toJSON()),
    headers: {
      'Content-Type': 'application/json',
    }
  });
};

export { registerDocument };