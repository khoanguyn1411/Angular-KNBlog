import { z } from 'zod';

export const userDtoSchema = z
  .object({
    _id: z.string(),
    email: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    lastLogin: z.string(),
    role: z.string(),
    pictureUrl: z.string().nullable(),
  })
  .readonly();

export type UserDto = z.infer<typeof userDtoSchema>;
