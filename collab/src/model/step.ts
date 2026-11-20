import z from 'zod';

const attributedUser = z.object({
  email: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  avatarUrl: z.string().optional(),
});

export const sendableSteps = z.object({
  version: z.number(),
  clientID: z.string(),
  clientTimestamp: z.string(),
  steps: z.array(z.any()), // TODO: model different types of step.
  user: attributedUser.optional(),
});

export type SendableSteps = z.infer<typeof sendableSteps>;
