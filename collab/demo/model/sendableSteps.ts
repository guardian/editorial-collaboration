import { z } from 'zod';

// TODO: share model between client and server
export const sendableSteps = z.object({
  timestamp: z.string(),
  content: z.object({
    version: z.number(),
    clientID: z.string(),
    steps: z.array(z.any()), // TODO: model different types of step.
  }),
});
export type SendableSteps = z.infer<typeof sendableSteps>;