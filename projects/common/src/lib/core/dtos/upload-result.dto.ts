import { z } from 'zod';

export const uploadResultSchemaDto = z.object({
  downloadUrl: z.string(),
  driveViewUrl: z.string(),
  viewUrl: z.string(),
});

export type UploadResultDto = z.infer<typeof uploadResultSchemaDto>;
