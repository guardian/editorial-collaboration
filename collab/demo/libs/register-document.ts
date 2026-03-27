import type { EditorView } from 'prosemirror-view';

const registerDocument = async (id: string, view: EditorView) => {
  await fetch(`https://editorial-collaboration.local.dev-gutools.co.uk/document/${id}/register`, {
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