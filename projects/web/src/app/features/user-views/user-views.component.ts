import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterOutlet } from '@angular/router';
import { DEFAULT_PAGINATION_OPTIONS } from '@knb/core/constants/pagination';
import { Pagination } from '@knb/core/models/pagination';
import { User } from '@knb/core/models/user';
import { UserApiService } from '@knb/core/services/api-services/user-api.service';
import { AccumulativeBlogsPageService } from '@knb/core/services/ui-services/accumulative-blogs-page.service';
import { toggleExecutionState } from '@knb/core/utils/rxjs/toggle-execution-state';
import { BlogPreviewComponent } from '@knb/shared/components/blog-preview/blog-preview.component';
import { UserPreviewComponent } from '@knb/shared/components/user-preview/user-preview.component';
import { isBoolean } from 'lodash';
import { Observable } from 'rxjs';

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
  private readonly userApiService = inject(UserApiService);
  private readonly isUsersPageLoading = signal(false);

  protected readonly accumulativeBlogsPageService = inject(AccumulativeBlogsPageService);
  protected userPage: Pagination<User> | null = null;
  protected readonly platformId = inject(PLATFORM_ID);

  protected readonly isBrowser = isBoolean(this.platformId);

  public constructor() {
    this.initializeUsersPage().subscribe((page) => {
      this.userPage = page;
    });
  }

  public ngOnInit(): void {
    this.initializeUsersPage().subscribe((page) => {
      console.log('Pere');
      this.userPage = page;
    });
  }

  private initializeUsersPage(): Observable<Pagination<User>> {
    return this.userApiService
      .getUsers({ ...DEFAULT_PAGINATION_OPTIONS, pageSize: 5 })
      .pipe(toggleExecutionState(this.isUsersPageLoading));
  }
}
