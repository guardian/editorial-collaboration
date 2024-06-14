import {
  AddMarkStep,
  AddNodeMarkStep,
  AttrStep,
  DocAttrStep,
  RemoveMarkStep,
  RemoveNodeMarkStep,
  ReplaceAroundStep,
  ReplaceStep,
  type Step,
} from "prosemirror-transform";

const defaultStepClasses = [
  RemoveMarkStep,
  AddMarkStep,
  AddNodeMarkStep,
  RemoveNodeMarkStep,
  ReplaceStep,
  ReplaceAroundStep,
  AttrStep,
  DocAttrStep,
];

const defaultStepTypes = defaultStepClasses.map(
  (stepClass) =>
    (stepClass.prototype as unknown as Step & { jsonID: string }).jsonID
);

// If we define custom steps, we would need to add their step types here.
const ourCustomStepTypes: string[] = [];

export const stepJsonIds = [
  ...defaultStepTypes,
  ...ourCustomStepTypes,
];

export type StepModel = { stepType: string } & Record<string, unknown>;
