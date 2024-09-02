import { Routes } from '@angular/router';
import { authGuard } from '@knb/core/guards/auth-guard';
import { webRoutePaths } from 'projects/web/src/shared/web-route-paths';

/** Blogs routes. */
export const blogsRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./blogs.component').then((c) => c.BlogsComponent),
    children: [
      {
        path: webRoutePaths.blogs.children.newBlog.path,
        loadComponent: () => import('./new-blog/new-blog.component').then((c) => c.NewBlogComponent),
        canMatch: [authGuard({ isAuthorized: true })],
      },
      {
        path: webRoutePaths.blogs.children.detail.path,
        loadComponent: () => import('./blog-detail/blog-detail.component').then((c) => c.BlogDetailComponent),
      },
    ],
  },
];
