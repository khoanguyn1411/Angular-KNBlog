/** Base filter parameters dto. */
export namespace BaseFilterParamsDto {
  /** Search filter. */
  export type Search = {
    /** Search filter. */
    readonly search: string;
  };

  /** Pagination filters. */
  export type Pagination = {
    /** Page size. */
    readonly limit: number;

    /** Page. */
    readonly offset: number;
  };

  type Sort = {
    /** Sort field. */
    readonly sort: string | undefined;
  };

  /** Search and pagination filters. */
  export type Combined = Search & Pagination & Sort;
}
