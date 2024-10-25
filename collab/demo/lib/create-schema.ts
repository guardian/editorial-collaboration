import { Schema } from 'prosemirror-model';
import { schema as basicSchema, marks } from 'prosemirror-schema-basic';

export const textElement = {
  isolating: true,
  group: 'element',
  content: 'block+',
  selectable: false,
  toDOM: () => ['div', { class: 'textElement' }, 0] as readonly [string, ...unknown[]]
};

const docNodeSpec = {
  doc: {
    content: 'block*',
    toDOM: (): [string, ...unknown[]] => ['div', 0],
  },
  textElement
};

const schema = new Schema({
  nodes: basicSchema.spec.nodes.append(docNodeSpec),
  marks,
});

export { schema }