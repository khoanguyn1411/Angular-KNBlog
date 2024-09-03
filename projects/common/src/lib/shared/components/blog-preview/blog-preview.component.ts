import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { Blog } from '@knb/core/models/blog';
import { injectWebAppRoutes } from 'projects/web/src/shared/web-route-paths';
import { AvatarComponent } from '../avatar/avatar.component';
import { UserPreviewComponent } from '../user-preview/user-preview.component';

/** Blog preview component. */
@Component({
  selector: 'knc-blog-preview',
  standalone: true,
  templateUrl: './blog-preview.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './blog-preview.component.scss',
  imports: [AvatarComponent, UserPreviewComponent, RouterModule, MatButtonModule, DatePipe],
})
export class BlogPreviewComponent {
  public readonly blog = input.required<Blog>();

  protected readonly routePaths = injectWebAppRoutes();

  protected readonly detailUrl = computed(() => this.routePaths.blogs.children.detail.url({ blogId: this.blog().id }));
}
