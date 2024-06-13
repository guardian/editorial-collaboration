import { Step, stepTypes } from "../types/step";

const isStep = (item: unknown): item is Step => {
  return !!(
    item &&
    typeof item === "object" &&
    "stepType" in item &&
    typeof item.stepType === "string" &&
    stepTypes.includes(item.stepType)
  );
};

export const validateSteps = (
  data: unknown
):
  | {
      valid: false;
    }
  | { valid: true; steps: Step[] } => {
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
