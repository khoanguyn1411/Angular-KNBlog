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
  /**
   * Get full name of user.
   * @param firstName First name.
   * @param lastName Last name.
   */
  export function getFullName(firstName: string, lastName: string) {
    return `${firstName} ${lastName}`;
  }
}
