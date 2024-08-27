import { z } from 'zod';
import { userDtoSchema } from './user.dto';

export const blogDtoSchema = z.object({
  _id: z.string(),
  writtenBy: userDtoSchema,
  title: z.string(),
  content: z.string(),
  summary: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  bannerUrl: z.string().nullable(),
});

export const blogCreationSchemaDto = blogDtoSchema.pick({
  title: true,
  content: true,
  bannerUrl: true,
  summary: true,
});

export type BlogCreationDto = z.infer<typeof blogCreationSchemaDto>;
export type BlogDto = z.infer<typeof blogDtoSchema>;
