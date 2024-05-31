import { z } from 'zod';

export const userSchema = z
  .object({
    id: z.string(),
    email: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    lastLogin: z.string(),
    role: z.string(),
  })
  .readonly();

export type User = z.infer<typeof userSchema>;
