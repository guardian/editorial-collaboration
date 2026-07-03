import { collab } from 'prosemirror-collab';
import { schema } from 'prosemirror-schema-basic';
import type { Plugin } from 'prosemirror-state';
import { EditorState } from 'prosemirror-state';

const configureEditorState = (
  plugins: Plugin[] = [collab()],
  document?: unknown
) => {
    if (document !== null) {
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