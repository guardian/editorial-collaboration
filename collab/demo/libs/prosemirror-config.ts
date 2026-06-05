import { collab } from 'prosemirror-collab';
import { schema } from 'prosemirror-schema-basic';
import { EditorState } from 'prosemirror-state';

const plugins = [collab()];

const createNewEditorState = () => {
  return EditorState.create({ schema, plugins });
};

export { createNewEditorState };