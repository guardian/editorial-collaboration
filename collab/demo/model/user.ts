import z from 'zod';

export const authenticatedUser = z.object({
  firstName: z.string(),
  lastName: z.string(),
  avatarUrl: z.string().optional(),
});

export type AuthenticatedUser = z.infer<typeof authenticatedUser>;
