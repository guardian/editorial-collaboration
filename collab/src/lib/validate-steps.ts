import { stepJsonIds, type StepModel } from "../types/step";

/* eslint-disable -- linter complains of @typescript-eslint/strict-boolean-expressions on line 7. Tried to disable that specific rule but it claims it isn't enabled */
const isStep = (item: unknown): item is StepModel => {
  return !!(
    !!item &&
    typeof item === "object" &&
    "stepType" in item &&
    typeof item.stepType === "string" &&
    stepJsonIds.includes(item.stepType)
  );
};
/* eslint-enable */

export const validateSteps = (
  data: unknown
):
  | {
      valid: false;
      steps?: undefined;
    }
  | { valid: true; steps: StepModel[] } => {
  if (!Array.isArray(data)) {
    return {
      valid: false,
    };
  }

  if (!data.every(isStep)) {
    return {
      valid: false,
    };
  }

  return {
    valid: true,
    steps: data,
  };
};
