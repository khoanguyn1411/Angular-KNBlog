import { z } from 'zod';

export const loginDataDtoSchema = z
  .object({
    email: z.string(),
    password: z.string(),
  })
  .readonly();

export type LoginDataDto = z.infer<typeof loginDataDtoSchema>;
