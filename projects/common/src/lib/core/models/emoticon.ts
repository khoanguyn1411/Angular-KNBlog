import { z } from 'zod';

export const emoticonCreation = z.object({
  blogId: z.string(),
});

export type EmoticonCreation = z.infer<typeof emoticonCreation>;
