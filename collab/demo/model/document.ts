import { z } from 'zod';

export const document = z.object({
  id: z.string(),
  timestamp: z.string(),
  document: z.any(), // The Prosemirror document is complex. We could attempt to validate it more strictly, but for now we just want to ensure it is present and is an object.
});
export type Document = z.infer<typeof document>;
