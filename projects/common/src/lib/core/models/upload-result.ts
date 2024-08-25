import { z } from 'zod';

export const uploadResultSchema = z.object({
  downloadUrl: z.string(),
  driveViewUrl: z.string(),
  viewUrl: z.string(),
});

export type UploadResult = z.infer<typeof uploadResultSchema>;
