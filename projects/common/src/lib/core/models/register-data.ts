import { z } from 'zod';

export const registerDataSchema = z
  .object({
    email: z.string(),
    password: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    pictureUrl: z.string().nullable(),
  })
  .readonly();

export type RegisterData = z.infer<typeof registerDataSchema>;
