import { AsyncPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, Renderer2 } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDividerModule } from '@angular/material/divider';
import { ActivatedRoute } from '@angular/router';
import { Blog, BlogDetail } from '@knb/core/models/blog';
import { BlogsApiService } from '@knb/core/services/api-services/blogs-api.service';
import { PlatformService } from '@knb/core/services/ui-services/platform.service';
import { SeoService } from '@knb/core/services/ui-services/seo.service';
import { UserService } from '@knb/core/services/ui-services/user.service';
import { filterNull } from '@knb/core/utils/rxjs/filter-null';
import { EmoticonButtonComponent } from '@knb/shared/components/emoticon-button/emoticon-button.component';
import { UserPreviewComponent } from '@knb/shared/components/user-preview/user-preview.component';
import { BLOG_ID_PARAM } from 'projects/web/src/shared/web-route-paths';
import { map, Observable, of, shareReplay, switchMap, tap } from 'rxjs';

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
export class BlogDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly blogsApiService = inject(BlogsApiService);
  private readonly userService = inject(UserService);
  private readonly seoService = inject(SeoService);
  private readonly renderer = inject(Renderer2);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly blogId$ = this.createBlogIdStream();
  protected readonly blogDetail$ = this.initializeBlogDetail();
  protected readonly isUserLikeBlog$ = this.initializeIsUserLikeBlog();
  protected readonly isPlatformBrowser = inject(PlatformService).isBrowserOnly;

  public ngOnInit(): void {
    this.addMetaTagsEffect().pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
  }

  private addMetaTagsEffect(): Observable<void> {
    return this.blogDetail$.pipe(
      tap((blogDetail) => {
        if (blogDetail == null) {
          return;
        }

        this.seoService.addTitle(blogDetail.title);
        this.seoService.addTags({
          description: blogDetail.summary,
        });
        this.seoService.addJsonLdScript(this.renderer, {
          title: blogDetail.title,
          imageUrl: blogDetail.bannerUrl ?? '',
          author: blogDetail.title,
          datePublished: blogDetail.createdAt,
        });
      }),
      map(() => undefined),
    );
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
      switchMap((isAuthorized) => {
        if (!isAuthorized) {
          return of(false);
        }
        return this.blogId$.pipe(
          filterNull(),
          switchMap((blogId) => this.blogsApiService.getBlogsWithEmoticons({ blogIds: [blogId] })),
          map((result) => result.length > 0),
        );
      }),
    );
  }
}
