import { buildRoutePaths } from './build-route-paths';

export const baseRoutePaths = buildRoutePaths({
  root: { path: '' },
} as const);
