import { Blog } from './blog';

export type BlogsWithEmoticonsParams = {
  readonly blogIds: readonly Blog['id'][];
};
