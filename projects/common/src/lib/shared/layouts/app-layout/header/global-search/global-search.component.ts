import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { Blog } from '@knb/core/models/blog';
import { AccumulativeBlogsPageService } from '@knb/core/services/ui-services/accumulative-blogs-page.service';
import { InputComponent } from '@knb/shared/components/inputs/input/input.component';
import { SkeletonDirective } from '@knb/shared/directives/skeleton.directive';
import { injectWebAppRoutes } from 'projects/web/src/shared/web-route-paths';

/** Global search component. */
@Component({
  selector: 'knc-global-search',
  standalone: true,
  templateUrl: './global-search.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [InputComponent, ReactiveFormsModule, MatIconModule, AsyncPipe, SkeletonDirective, RouterModule],
  styleUrls: ['./global-search.component.scss'],
})
export class GlobalSearchComponent extends AccumulativeBlogsPageService {
  protected readonly isSearchResultsOpen = signal(false);

  protected readonly fb = inject(NonNullableFormBuilder);
  protected readonly searchControl = this.fb.control('');

  private readonly searchControlSignal = toSignal(this.searchControl.valueChanges);
  private readonly routePaths = injectWebAppRoutes();

  protected onFocus() {
    this.isSearchResultsOpen.set(true);
  }

  protected onBlur() {
    // this.isSearchResultsOpen.set(false);
  }

  protected getBlogDetailLink(blog: Blog) {
    return this.routePaths.blogs.children.detail.url({ blogId: blog.id });
  }

  private searchChangeEffect = effect(
    () => {
      this.setFilters({ search: this.searchControlSignal()?.trim() });
    },
    { allowSignalWrites: true },
  );
}
