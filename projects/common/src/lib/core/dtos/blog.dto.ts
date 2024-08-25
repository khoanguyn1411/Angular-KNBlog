import { z } from 'zod';

export const blogCreationSchemaDto = z.object({
  title: z.string(),
  content: z.string(),
  summary: z.string(),
  bannerUrl: z.string().optional(),
});

export type BlogCreationDto = z.infer<typeof blogCreationSchemaDto>;
