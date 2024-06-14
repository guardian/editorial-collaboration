import { validateSteps } from "./validate-steps";

const validStepTypes = {
  DOC_ATTR: "docAttr",
  REPLACE: "replace",
  REMOVE_MARK: "removeMark",
};

describe(validateSteps.name, () => {
  it("will pass an empty array", () => {
    const result = validateSteps([]);
    expect(result.valid).toBe(true);
  });
  it("will fail an array of primitives", () => {
    const result = validateSteps([true, 12, "string"]);
    expect(result.valid).toBe(false);
  });
  it("will fail a steps where any step has an invalid stepType", () => {
    const result = validateSteps([
      {
        stepType: "no-such-step-type-as-this",
      },
      {
        stepType: validStepTypes.DOC_ATTR,
      },
    ]);
    expect(result.valid).toBe(false);
  });
  it("will accept an array of steps with valid stepTypes, regardless of the other fields in each step", () => {
    const result = validateSteps([
      {
        stepType: validStepTypes.DOC_ATTR,
        arbitraryField: {
          size: 23,
        },
      },
      {
        stepType: validStepTypes.REPLACE,
        arbitraryField: {
          letters: ["a"],
        },
      },
      {
        stepType: validStepTypes.REMOVE_MARK,
        foo: "bar",
      },
    ]);
    expect(result.valid).toBe(true);
    expect(result.steps?.length).toBe(3)
  });
});
