import { z } from 'zod';

// TODO: share model between client and server
const sendableSteps = z.object({
  version: z.number(),
  clientID: z.xor([z.string(), z.number()]),
  steps: z.array(z.any()), // TODO: model different types of step.
})

const sendableStepsFromServer = z.object({
  timestamp: z.string(),
  content: sendableSteps,
});

type SendableSteps = z.infer<typeof sendableSteps>;
type SendableStepsFromServer = z.infer<typeof sendableStepsFromServer>;

export {
  sendableSteps,
  sendableStepsFromServer,
  type SendableSteps,
  type SendableStepsFromServer,
};
