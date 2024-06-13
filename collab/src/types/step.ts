export const stepTypes = [
  "addMark",
  "removeMark",
  "addNodeMark",
  "removeNodeMark",
  "replace",
  "replaceAround",
  "attr",
  "docAttr",
];

export type StepType =
  | "addMark"
  | "removeMark"
  | "addNodeMark"
  | "removeNodeMark"
  | "replace"
  | "replaceAround"
  | "attr"
  | "docAttr";

export type Step = { stepType: StepType } & Record<string, unknown>;
