import { TypeOf, ZodType, z } from 'zod';

/**
 * Creates pagination DTO schema.
 * @param itemSchema Some item schema.
 */
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function createPaginationDtoSchema<T extends z.ZodTypeAny>(itemSchema: T) {
  return z
    .object({
      offset: z.number(),
      limit: z.number(),
      count: z.number(),
      results: z.array(itemSchema),
    })
    .strict();
}

/** Pagination DTO. */
export type PaginationDto<T> = TypeOf<ReturnType<typeof createPaginationDtoSchema<ZodType<T>>>>;
