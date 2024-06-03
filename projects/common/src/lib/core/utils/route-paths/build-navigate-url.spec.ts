import { buildNavigateUrl } from './build-navigate-url';

describe('buildNavigateUrl', () => {
  it('builds url with params', () => {
    const url = 'users/:userId/projects/:projectId/edit';
    const params = { userId: 10, projectId: '1' };

    expect(buildNavigateUrl(url, params)).toBe(
      `users/${params.userId}/projects/${params.projectId}/edit`,
    );
  });
});
