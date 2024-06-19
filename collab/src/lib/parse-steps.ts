import type { Json } from "../types/json";
import { stepJsonIds, type StepModel } from "../types/step";

/* eslint-disable -- linter complains of @typescript-eslint/strict-boolean-expressions on line 7. Tried to disable that specific rule but it claims it isn't enabled */
const isStep = (item: Json): item is StepModel => {
  return !!(
    !!item &&
    typeof item === "object" &&
    "stepType" in item &&
    typeof item["stepType"] === "string" &&
    stepJsonIds.includes(item["stepType"])
  );
};
/* eslint-enable */

export const parseSteps = (data: Json): StepModel[] | undefined => {
  if (!Array.isArray(data)) {
    return undefined;
  }

  if (!data.every(isStep)) {
    return undefined;
  }

  return data;
};
