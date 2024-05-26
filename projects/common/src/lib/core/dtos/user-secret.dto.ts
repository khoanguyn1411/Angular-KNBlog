import { z } from 'zod';

/** User secret DTO schema. */
export const userSecretDtoSchema = z
  .object({
    /** Access token. */
    accessToken: z.string(),

    /** Token expiry. */
    refreshToken: z.string(),
  })
  .readonly();

/** User secret DTO schema. */
export const userSecretCreationDtoSchema = z
  .object({
    /** Refresh token. */
    refreshToken: z.string(),
  })
  .strict();

/** User secret DTO. */
export type UserSecretDto = Readonly<z.infer<typeof userSecretDtoSchema>>;

/** User secret creation DTO. */
export type UserSecretCreationDto = Readonly<
  z.infer<typeof userSecretCreationDtoSchema>
>;
