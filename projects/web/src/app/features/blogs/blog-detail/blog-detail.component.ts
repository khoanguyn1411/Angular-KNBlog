import { AsyncPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { ActivatedRoute } from '@angular/router';
import { Blog } from '@knb/core/models/blog';
import { BlogsApiService } from '@knb/core/services/api-services/blogs-api.service';
import { filterNull } from '@knb/core/utils/rxjs/filter-null';
import { UserPreviewComponent } from '@knb/shared/components/user-preview/user-preview.component';
import { BLOG_ID_PARAM } from 'projects/web/src/shared/web-route-paths';
import { map, Observable, shareReplay, switchMap } from 'rxjs';

/** Blog detail component. */
@Component({
  selector: 'knw-blog-detail',
  standalone: true,
  templateUrl: './blog-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AsyncPipe, UserPreviewComponent, DatePipe, MatDividerModule],
  styleUrl: './blog-detail.component.scss',
})
export class BlogDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly blogsApiService = inject(BlogsApiService);
  private readonly blogId$ = this.createJobIdStream();

  protected readonly blogDetail$ = this.initializeBlogDetail();

  private createJobIdStream(): Observable<Blog['id'] | null> {
    return this.route.paramMap.pipe(
      map((params) => params.get(BLOG_ID_PARAM)),
      shareReplay({ refCount: true, bufferSize: 1 }),
    );
  }

  private initializeBlogDetail() {
    return this.blogId$.pipe(
      filterNull(),
      switchMap((blogId) => this.blogsApiService.getBlogById(blogId)),
    );
  }
}
