import { buildRoutePaths } from './build-route-paths';

export const ALERT_ID_PARAM_NAME = 'alertId';

const baseRoutePaths = buildRoutePaths({
  root: { path: '' },
} as const);

const authRoutePaths = buildRoutePaths({
  auth: {
    path: 'auth',
    children: {
      login: { path: 'login' },
      register: { path: 'register' },
    },
  },
} as const);

const homeRoutePaths = buildRoutePaths({
  root: { path: 'home' },
} as const);


/** Route paths can be used throughout the project. */
export const routePaths = {
  ...baseRoutePaths,
  ...authRoutePaths,
  ...homeRoutePaths
};
