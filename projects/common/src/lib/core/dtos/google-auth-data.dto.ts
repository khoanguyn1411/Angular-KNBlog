import { z } from 'zod';

export const googleAuthDataDto = z
  .object({
    googleTokenId: z.string(),
    pictureUrl: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    email: z.string(),
  })
  .readonly();

export type GoogleAuthDataDto = z.infer<typeof googleAuthDataDto>;
