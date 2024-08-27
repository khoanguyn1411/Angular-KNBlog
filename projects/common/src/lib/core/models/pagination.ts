import { StrictOmit } from '../utils/types/strict-omit';

type PaginationConstructorData<T> = StrictOmit<Pagination<T>, 'hasItems'>;

/** Pagination wrapper. */
export class Pagination<T> {
  /** Items on the page. */
  public readonly items: readonly T[];

  /** Total count in the store. */
  public readonly totalCount: number;

  /** Whether the pagination have next pages. */
  public readonly hasNext: boolean;

  /** Whether the pagination have prev pages. */
  public readonly hasPrev: boolean;

  public constructor(data: PaginationConstructorData<T>) {
    this.items = data.items;
    this.totalCount = data.totalCount;
    this.hasNext = data.hasNext;
    this.hasPrev = data.hasPrev;
  }

  /** Whether items is present or not.  */
  public get hasItems(): boolean {
    return this.items.length > 0;
  }
}
