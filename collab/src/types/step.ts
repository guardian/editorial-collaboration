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
import type { Json } from "./json";

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

/**
 * Under the hood "prosemirror-transform" assigns a `jsonID` property to each of
 * the default subclasses of `Step`. It corresponds to value of the `stepType`
 * property of the object returned by the subclass's `toJSON` method.
 *
 * E.G. `ReplaceStep.jsonID` is "replace" and `replaceStep.toJson` returns an object
 * with a `stepType` of "replace".
 *
 * `jsonID` is used internally by `Step.fromJson` to look up the right subclass
 * to deserialise JSON to.
 *
 * We can use it here to derive the list of possible `stepTypes` that a valid
 * JSON serialised `Step` can have
 */
const defaultStepTypes = defaultStepClasses.map(
  (stepClass) =>
    (stepClass.prototype as unknown as Step & { jsonID: string }).jsonID
);

/**
 * Prosemirror allows developer to define custom subclasses of `Step` (see
 * the annotation on the `Step` type).
 *
 * If we do this, we would need to add the `stepType` here.
 */
const ourCustomStepTypes: string[] = [];

export const stepJsonIds = [...defaultStepTypes, ...ourCustomStepTypes];

export type StepModel = { stepType: string } & Record<string, Json>;
