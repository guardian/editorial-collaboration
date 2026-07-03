import { z } from 'zod';

// TODO: share model between client and server
const sendableSteps = z.object({
  version: z.number(),
  clientID: z.xor([z.string(), z.number()]),
  clientTimestamp: z.string(),
  steps: z.array(z.any()), // TODO: model different types of step.
});

const stepServerResponse = z.array(z.object({
  content: sendableSteps
}))

type SendableSteps = z.infer<typeof sendableSteps>;

/**
 * The from and to index of a selected range in an array of Steps.
 */
type StepSelection = { from: number; to: number };

export {
  sendableSteps,
  stepServerResponse,
  type SendableSteps,
  type StepSelection,
};
