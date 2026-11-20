import { z } from 'zod';

// TODO: share model between client and server
const attributedUser = z.object({
  email: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  avatarUrl: z.string().optional(),
});

const sendableSteps = z.object({
  version: z.number(),
  clientID: z.xor([z.string(), z.number()]),
  clientTimestamp: z.string(),
  steps: z.array(z.any()), // TODO: model different types of step.
  user: attributedUser.optional(),
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
