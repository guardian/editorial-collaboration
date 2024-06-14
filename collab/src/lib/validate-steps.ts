import { StepModel, stepJsonIds } from "../types/step";

const isStep = (item: unknown): item is StepModel => {
  return !!(
    item &&
    typeof item === "object" &&
    "stepType" in item &&
    typeof item.stepType === "string" &&
    stepJsonIds.includes(item.stepType)
  );
};

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
