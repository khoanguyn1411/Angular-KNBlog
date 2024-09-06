import { z } from 'zod';
import { userSchema } from './user';

export const blogSchema = z.object({
  id: z.string(),
  writtenByUser: userSchema,
  title: z.string(),
  summary: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  emoticonCount: z.number(),
  bannerUrl: z.string().nullable(),
  isUserLiked: z.boolean(),
});

export const blogDetailSchema = blogSchema.extend({
  content: z.string(),
});

export const blogCreationSchema = blogDetailSchema.pick({
  title: true,
  content: true,
  bannerUrl: true,
  summary: true,
});

export type BlogCreation = z.infer<typeof blogCreationSchema>;
export type Blog = z.infer<typeof blogSchema>;
export type BlogDetail = z.infer<typeof blogDetailSchema>;
