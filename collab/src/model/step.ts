import z from 'zod';

export const sendableSteps = z.object({
  version: z.number(),
  clientID: z.string(),
  clientTimestamp: z.number(),
  steps: z.array(z.any()), // TODO: model different types of step.
});

export type SendableSteps = z.infer<typeof sendableSteps>;
