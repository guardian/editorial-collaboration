import { parseSteps } from "./parse-steps";

const validStepTypes = {
  DOC_ATTR: "docAttr",
  REPLACE: "replace",
  REMOVE_MARK: "removeMark",
};

describe(parseSteps.name, () => {
  it("will parse an empty array", () => {
    const result = parseSteps([]);
    expect(result).toEqual([]);
  });
  it("will return undefined for an array of primitives", () => {
    const result = parseSteps([true, 12, "string"]);
    expect(result).toBeUndefined();
  });
  it("will fail a steps where any step has an invalid stepType", () => {
    const result = parseSteps([
      {
        stepType: "no-such-step-type-as-this",
      },
      {
        stepType: validStepTypes.DOC_ATTR,
      },
    ]);
    expect(result).toBeUndefined();
  });
  it("will accept an array of steps with valid stepTypes, regardless of the other fields in each step", () => {
    const result = parseSteps([
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
    expect(result?.length).toBe(3);
  });
});
