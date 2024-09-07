import { AsyncPipe, DatePipe, isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, PLATFORM_ID } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { ActivatedRoute } from '@angular/router';
import { Blog, BlogDetail } from '@knb/core/models/blog';
import { BlogsApiService } from '@knb/core/services/api-services/blogs-api.service';
import { UserService } from '@knb/core/services/ui-services/user.service';
import { filterNull } from '@knb/core/utils/rxjs/filter-null';
import { EmoticonButtonComponent } from '@knb/shared/components/emoticon-button/emoticon-button.component';
import { UserPreviewComponent } from '@knb/shared/components/user-preview/user-preview.component';
import { BLOG_ID_PARAM } from 'projects/web/src/shared/web-route-paths';
import { filter, map, Observable, shareReplay, switchMap } from 'rxjs';

/** Blog detail component. */
@Component({
  selector: 'knw-blog-detail',
  standalone: true,
  templateUrl: './blog-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AsyncPipe,
    UserPreviewComponent,
    DatePipe,
    MatDividerModule,
    EmoticonButtonComponent,
    EmoticonButtonComponent,
  ],
  styleUrl: './blog-detail.component.scss',
})
export class BlogDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly blogsApiService = inject(BlogsApiService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly userService = inject(UserService);

  protected readonly blogId$ = this.createBlogIdStream();
  protected readonly blogDetail$ = this.initializeBlogDetail();
  protected readonly isUserLikeBlog$ = this.initializeIsUserLikeBlog();

  protected get isPlatformBrowser() {
    return isPlatformBrowser(this.platformId);
  }

  private createBlogIdStream(): Observable<Blog['id'] | null> {
    return this.route.paramMap.pipe(
      map((params) => params.get(BLOG_ID_PARAM)),
      shareReplay({ refCount: true, bufferSize: 1 }),
    );
  }

  private initializeBlogDetail(): Observable<BlogDetail> {
    return this.blogId$.pipe(
      filterNull(),
      switchMap((blogId) => this.blogsApiService.getBlogById(blogId)),
    );
  }

  private initializeIsUserLikeBlog(): Observable<boolean> {
    return this.userService.isAuthorized$.pipe(
      filter(Boolean),
      switchMap(() => {
        return this.blogId$.pipe(
          filterNull(),
          switchMap((blogId) => this.blogsApiService.getBlogsWithEmoticons({ blogIds: [blogId] })),
          map((result) => result.length > 0),
        );
      }),
    );
  }
}
