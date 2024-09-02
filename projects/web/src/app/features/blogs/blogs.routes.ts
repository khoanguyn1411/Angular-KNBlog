import { Routes } from '@angular/router';
import { webRoutePaths } from 'projects/web/src/shared/web-route-paths';
import { BlogDetailComponent } from './blog-detail/blog-detail.component';
import { BlogsComponent } from './blogs.component';
import { NewBlogComponent } from './new-blog/new-blog.component';

/** Blogs routes. */
export const blogsRoutes: Routes = [
  {
    path: '',
    component: BlogsComponent,
    children: [
      {
        path: webRoutePaths.blogs.children.newBlog.path,
        component: NewBlogComponent,
      },
      {
        path: webRoutePaths.blogs.children.detail.path,
        component: BlogDetailComponent,
      },
    ],
  },
];
