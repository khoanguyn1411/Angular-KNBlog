import { AsyncPipe, isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, PLATFORM_ID } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { Blog } from '@knb/core/models/blog';
import { BlogsApiService } from '@knb/core/services/api-services/blogs-api.service';
import { filterNull } from '@knb/core/utils/rxjs/filter-null';
import { EmoticonButtonComponent } from '@knb/shared/components/emoticon-button/emoticon-button.component';
import { Observable, switchMap } from 'rxjs';

/** Blog detail emoticon component. */
@Component({
  selector: 'knw-blog-detail-emoticon',
  standalone: true,
  templateUrl: './blog-detail-emoticon.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [EmoticonButtonComponent, AsyncPipe],
  styleUrl: './blog-detail-emoticon.component.scss',
})
export class BlogDetailEmoticonComponent {
  public readonly blogId = input.required<Blog['id']>();

  private readonly platformId = inject(PLATFORM_ID);
  private readonly blogsApiService = inject(BlogsApiService);
  private readonly blogId$ = toObservable(this.blogId);

  protected readonly blogDetail$: Observable<Blog>;

  public get isBrowserOnly(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  public constructor() {
    this.blogDetail$ = this.initializeBlogDetail();
  }

  private initializeBlogDetail() {
    return this.blogId$.pipe(
      filterNull(),
      switchMap((blogId) => this.blogsApiService.getBlogById(blogId)),
    );
  }
}
