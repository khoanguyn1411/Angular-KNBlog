import { z } from 'zod';
import { userDtoSchema } from './user.dto';

export const blogDtoSchema = z.object({
  _id: z.string(),
  writtenBy: userDtoSchema,
  title: z.string(),
  summary: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  emoticonCount: z.number(),
  bannerUrl: z.string().nullable(),
  isUserLiked: z.boolean(),
});

export const blogDetailDtoSchema = blogDtoSchema.extend({
  content: z.string(),
});

export const blogCreationSchemaDto = blogDetailDtoSchema.pick({
  title: true,
  content: true,
  bannerUrl: true,
  summary: true,
});

export type BlogCreationDto = z.infer<typeof blogCreationSchemaDto>;
export type BlogDto = z.infer<typeof blogDtoSchema>;
export type BlogDetailDto = z.infer<typeof blogDetailDtoSchema>;
