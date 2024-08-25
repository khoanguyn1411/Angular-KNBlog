import { z } from 'zod';

export const blogCreationSchema = z.object({
  title: z.string(),
  content: z.string(),
  summary: z.string(),
  bannerUrl: z.string().nullable(),
});

export type BlogCreation = z.infer<typeof blogCreationSchema>;
