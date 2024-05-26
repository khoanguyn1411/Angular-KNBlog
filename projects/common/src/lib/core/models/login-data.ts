import { z } from 'zod';

export const loginDataSchema = z
  .object({
    email: z.string(),
    password: z.string(),
  })
  .readonly();

export type LoginData = z.infer<typeof loginDataSchema>;
