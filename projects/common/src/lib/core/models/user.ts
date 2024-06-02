import { z } from 'zod';

export const userSchema = z
  .object({
    id: z.string(),
    email: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    fullName: z.string(),
    lastLogin: z.string(),
    role: z.string(),
    pictureUrl: z.string().nullable(),
  })
  .readonly();

export type User = z.infer<typeof userSchema>;
export namespace User {
  export function getFullName(firstName: string, lastName: string) {
    return `${firstName} ${lastName}`
  }
}
