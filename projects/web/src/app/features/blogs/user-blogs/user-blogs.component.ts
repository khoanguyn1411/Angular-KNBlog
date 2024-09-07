import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute } from '@angular/router';
import { Blog } from '@knb/core/models/blog';
import { Pagination } from '@knb/core/models/pagination';
import { User } from '@knb/core/models/user';
import { UserApiService } from '@knb/core/services/api-services/user-api.service';
import { AccumulativeBlogsPageService } from '@knb/core/services/ui-services/accumulative-blogs-page.service';
import { PlatformService } from '@knb/core/services/ui-services/platform.service';
import { SeoService } from '@knb/core/services/ui-services/seo.service';
import { filterNull } from '@knb/core/utils/rxjs/filter-null';
import { accumulativePagination } from '@knb/core/utils/rxjs/paginate';
import { toggleExecutionState } from '@knb/core/utils/rxjs/toggle-execution-state';
import { BlogPreviewComponent } from '@knb/shared/components/blog-preview/blog-preview.component';
import { USER_ID_PARAM } from 'projects/web/src/shared/web-route-paths';
import { map, Observable, of, shareReplay, switchMap, tap } from 'rxjs';

/** User blogs component. */
@Component({
  selector: 'knw-user-blogs',
  standalone: true,
  templateUrl: './user-blogs.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AsyncPipe, BlogPreviewComponent, MatButtonModule],
  styleUrl: './user-blogs.component.scss',
})
export class UserBlogsComponent extends AccumulativeBlogsPageService implements OnInit {
  private readonly seoService = inject(SeoService);
  private readonly userApiService = inject(UserApiService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly isBrowserOnly = inject(PlatformService).isBrowserOnly;

  public ngOnInit(): void {
    this.createUserIdStream(this.activatedRoute)
      .pipe(
        filterNull(),
        switchMap((userId) => this.userApiService.getUserById(userId)),
        tap((user) => {
          this.seoService.addTitle(user.fullName);
          this.seoService.addTags({ description: user.fullName, imageUrl: user.pictureUrl ?? '' });
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  private createUserIdStream(route: ActivatedRoute): Observable<User['id'] | null> {
    return route.paramMap.pipe(
      map((params) => params.get(USER_ID_PARAM)),
      shareReplay({ refCount: true, bufferSize: 1 }),
    );
  }

  protected override initializeBlogsPage(): Observable<Pagination<Blog>> {
    const route = inject(ActivatedRoute);
    const userId$ = this.createUserIdStream(route);
    return accumulativePagination(
      // Using `debounceTime(0)` here to make the filter emits only 1 time after all changes has synchronously emitted.
      // eslint-disable-next-line rxjs/finnish
      { filters: this.filters$, userId: userId$ },
      ({ filters, userId }) =>
        this.blogsApiService.getBlogs({ ...filters, userId }).pipe(toggleExecutionState(this.isLoading)),
      of(null),
    ).pipe(filterNull(), shareReplay({ refCount: true, bufferSize: 1 }));
  }
}
