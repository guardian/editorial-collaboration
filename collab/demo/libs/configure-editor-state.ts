import { collab } from 'prosemirror-collab';
import type { Plugin } from 'prosemirror-state';
import { EditorState } from 'prosemirror-state';
import { schema } from './schema';

const configureEditorState = (
  plugins: Plugin[] = [collab()],
  document?: unknown
) => {
    if (document !== undefined) {
      try {
        const doc = schema.nodeFromJSON(document);
        return EditorState.create({ doc, schema, plugins });
      } catch (err) {
        console.error('Failed to create ProseMirror document from JSON:', err);
        return EditorState.create({ schema, plugins });
      }
    }
    return EditorState.create({ schema, plugins });
};

export { configureEditorState };