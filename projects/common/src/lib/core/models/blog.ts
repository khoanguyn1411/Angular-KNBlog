import { z } from 'zod';
import { userSchema } from './user';

export const blogSchema = z.object({
  id: z.string(),
  writtenByUser: userSchema,
  title: z.string(),
  content: z.string(),
  summary: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  bannerUrl: z.string().nullable(),
});

export const blogCreationSchema = blogSchema.pick({
  title: true,
  content: true,
  bannerUrl: true,
  summary: true,
});

export type BlogCreation = z.infer<typeof blogCreationSchema>;
export type Blog = z.infer<typeof blogSchema>;
