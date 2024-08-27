import { z } from 'zod';

/**
 * Safely parses data using Zod.
 * Sometimes the original Zod parser does not log error messages to the console,
 * making it difficult to identify which field is incorrect, especially with nested properties.
 * This function aims to improve error traceability.
 * @param schema The Zod schema to use for parsing.
 * @param data The data to validate against the schema.
 */
export function safeParse<T extends z.ZodTypeAny>(schema: T, data: unknown): z.infer<T> {
  const dataAfterParsed = schema.safeParse(data);
  if (dataAfterParsed.success) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return schema.safeParse(data).data;
  }
  throw new Error(dataAfterParsed.error.message);
}
