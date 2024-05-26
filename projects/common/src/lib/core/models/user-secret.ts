import { z } from 'zod';

/** User secret schema. */
export const userSecretSchema = z
  .object({
    /** Access token. */
    accessToken: z.string(),
    refreshToken: z.string(),
  })
  .readonly();

/** User secret. */
export type UserSecret = Readonly<z.infer<typeof userSecretSchema>>;
