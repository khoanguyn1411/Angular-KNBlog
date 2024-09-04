import { z } from 'zod';

export const emoticonCreationDto = z.object({
  blogId: z.string(),
});

export type EmoticonCreationDto = z.infer<typeof emoticonCreationDto>;
