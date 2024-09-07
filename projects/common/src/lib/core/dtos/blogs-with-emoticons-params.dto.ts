import { BlogDto } from './blog.dto';

export type BlogsWithEmoticonsParamsDto = {
  readonly blogIds: readonly BlogDto['_id'][];
};
