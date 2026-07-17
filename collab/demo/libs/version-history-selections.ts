import type { SendableSteps, StepSelection } from '../model/steps';

type Config = {
  minTimeStep: number; // minutes
  maxTimeStep: number; // minutes
  meaningfulChangeThreshold: number; // step count
}

const defaultConfig = {
  minTimeStep: 5,
  maxTimeStep: 60,
  meaningfulChangeThreshold: 100
};

/**
 * Takes an array of steps and groups them together, returning an array of selections that provide the 'from' index and
 * the 'to' index of each group within the step array. The grouping is defined by the config object.
 * @param steps - the document steps, representing a series of chronological (step) changes in the document.
 * @param config - the configuration object that defines how to group steps together. It has the following properties:
 *    - minTimeStep: the minimum time granularity (in minutes) to consider when grouping steps together by client timestamp.
 *    - maxTimeStep: the maximum time granularity (in minutes) to consider when grouping steps together by client timestamp.
 *                If the grouping provided by the minTimeStep does not reach the meaningfulChangeThreshold it will group
 *                steps in larger time windows until either the meaningfulChangeThreshold or the maxTimeStep is met.
 *    - meaningfulChangeThreshold: the number of steps we consider to be a meaningful change in the document. If the number
 *                of steps in a group is less than this threshold, we will attempt to group them with other steps until
 *                we reach this threshold or the maxTimeStep is met.
 */
const getVersionHistorySelections = (steps: SendableSteps[], config: Config = defaultConfig): StepSelection[] => {
  if (steps.length === 0) {
    return [];
  }

  const minTimeStepMs = config.minTimeStep * 60 * 1000;
  const maxTimeStepMs = config.maxTimeStep * 60 * 1000;
  const selections: StepSelection[] = [];

  let selectionStart = 0;
  let currentSelectionChangeCount = steps[0]?.steps.length ?? 0;
  let currentSelectionStartTimestamp = new Date(steps[0]?.clientTimestamp ?? 0).getTime();

  for (let index = 1; index < steps.length; index += 1) {
    const previousStep = steps[index - 1];
    const currentStep = steps[index];

    if (previousStep == null || currentStep == null) {
      continue;
    }

    const previousTimestamp = new Date(previousStep.clientTimestamp).getTime();
    const currentTimestamp = new Date(currentStep.clientTimestamp).getTime();

    if (currentTimestamp - previousTimestamp < minTimeStepMs) {
      currentSelectionChangeCount += currentStep.steps.length;
      continue;
    }

    const wouldExceedMaxWindow = currentTimestamp - currentSelectionStartTimestamp > maxTimeStepMs;
    const hasMeaningfulChange = currentSelectionChangeCount >= config.meaningfulChangeThreshold;

    if (hasMeaningfulChange || wouldExceedMaxWindow) {
      selections.push({ from: selectionStart, to: index - 1 });
      selectionStart = index;
      currentSelectionStartTimestamp = currentTimestamp;
      currentSelectionChangeCount = currentStep.steps.length;
      continue;
    }

    currentSelectionChangeCount += currentStep.steps.length;
  }

  selections.push({ from: selectionStart, to: steps.length - 1 });

  // order selections by newest to oldest
  selections.reverse();

  return selections;
}

export { getVersionHistorySelections };