import { z } from 'zod';

export const googleAuthData = z
  .object({
    googleTokenId: z.string(),
    pictureUrl: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    email: z.string(),
  })
  .readonly();

export type GoogleAuthData = z.infer<typeof googleAuthData>;
