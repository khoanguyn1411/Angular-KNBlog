import { z } from 'zod';

export const registerDataDtoSchema = z
  .object({
    email: z.string(),
    password: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    pictureUrl: z.string().nullable(),
  })
  .readonly();

export type RegisterDataDto = z.infer<typeof registerDataDtoSchema>;
