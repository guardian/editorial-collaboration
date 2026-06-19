import { z } from 'zod';

// TODO: share model between client and server
const sendableSteps = z.object({
  version: z.number(),
  clientID: z.xor([z.string(), z.number()]),
  clientTimestamp: z.number(),
  steps: z.array(z.any()), // TODO: model different types of step.
});

const stepServerReponse = z.array(z.object({
  content: sendableSteps
}))

type SendableSteps = z.infer<typeof sendableSteps>;

export {
  sendableSteps,
  stepServerReponse,
  type SendableSteps,
};
