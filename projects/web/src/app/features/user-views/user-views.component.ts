import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterOutlet } from '@angular/router';
import { APP_NAME, APP_SUMMARY } from '@knb/core/constants/app-info';
import { DEFAULT_PAGINATION_OPTIONS } from '@knb/core/constants/pagination';
import { Pagination } from '@knb/core/models/pagination';
import { User } from '@knb/core/models/user';
import { UserApiService } from '@knb/core/services/api-services/user-api.service';
import { AccumulativeBlogsPageService } from '@knb/core/services/ui-services/accumulative-blogs-page.service';
import { PlatformService } from '@knb/core/services/ui-services/platform.service';
import { SeoService } from '@knb/core/services/ui-services/seo.service';
import { toggleExecutionState } from '@knb/core/utils/rxjs/toggle-execution-state';
import { BlogPreviewComponent } from '@knb/shared/components/blog-preview/blog-preview.component';
import { UserPreviewComponent } from '@knb/shared/components/user-preview/user-preview.component';
import { Observable, shareReplay } from 'rxjs';

/** User views component. */
@Component({
  selector: 'knw-user-views',
  standalone: true,
  templateUrl: './user-views.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, AsyncPipe, BlogPreviewComponent, UserPreviewComponent, MatButtonModule],
  providers: [AccumulativeBlogsPageService],
  styleUrls: ['./user-views.component.scss'],
})
export class UserViewsComponent implements OnInit {
  private readonly seoService = inject(SeoService);

  private readonly userApiService = inject(UserApiService);
  protected readonly accumulativeBlogsPageService = inject(AccumulativeBlogsPageService);

  private readonly isUsersPageLoading = signal(false);

  protected readonly usersPage$: Observable<Pagination<User>>;
  protected readonly isBrowserOnly = inject(PlatformService).isBrowserOnly;
  protected readonly appName = APP_NAME;

  public constructor() {
    this.usersPage$ = this.initializeUsersPage();
  }

  public ngOnInit(): void {
    this.addMetaTags();
  }

  private addMetaTags() {
    // Set the title
    this.seoService.addTitle('Blogs');

    // Add meta tags
    this.seoService.addTags({
      description: APP_SUMMARY,
      keywords: 'blogs, posts, write, write blogs, knblogs',
    });
  }

  private initializeUsersPage(): Observable<Pagination<User>> {
    return this.userApiService
      .getUsers({ ...DEFAULT_PAGINATION_OPTIONS, pageSize: 5 })
      .pipe(toggleExecutionState(this.isUsersPageLoading), shareReplay({ refCount: true, bufferSize: 1 }));
  }
}
