import type { NodeSpec } from "prosemirror-model";
import { Schema } from "prosemirror-model";
import { nodes as basicNodes, marks } from "prosemirror-schema-basic";

const textElement: NodeSpec = {
  isolating: true,
  group: "textElement",
  content: "block+",
  selectable: false,
  parseDOM: [{ tag: "div.textElement" }],
  toDOM: () => ["div", { class: "textElement" }, 0],
};

const textElementNodes = {
  ...basicNodes,
  doc: {
    ...basicNodes.doc,
    content: "(textElement | block)+",
  },
  textElement,
};

export const schema = new Schema({ nodes: textElementNodes, marks });
