import type { Json } from "../types/json";
import { stepTypeIds, type StepModel } from "../types/step";

const isStep = (item: Json): item is StepModel => {
  return !!(
    typeof item === "object" &&
    item != null &&
    "stepType" in item &&
    typeof item["stepType"] === "string" &&
    stepTypeIds.includes(item["stepType"])
  );
};

export const parseSteps = (data: Json): StepModel[] | undefined => {
  if (!Array.isArray(data)) {
    return undefined;
  }

  if (!data.every(isStep)) {
    return undefined;
  }

  return data;
};
