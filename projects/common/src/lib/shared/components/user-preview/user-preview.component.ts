import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { User } from '@knb/core/models/user';
import { injectWebAppRoutes } from 'projects/web/src/shared/web-route-paths';
import { AvatarComponent } from '../avatar/avatar.component';

/** User preview component. */
@Component({
  selector: 'knc-user-preview',
  standalone: true,
  templateUrl: './user-preview.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './user-preview.component.scss',
  imports: [AvatarComponent, RouterModule],
})
export class UserPreviewComponent {
  public readonly user = input.required<User>();

  private readonly routePaths = injectWebAppRoutes();

  protected readonly userBlogsUrl = computed(() => {
    const userId = this.user().id;
    if (userId == null) {
      return '';
    }
    return this.routePaths.blogs.children.user.url({ userId });
  });

  protected onUserInfoClick(event: MouseEvent) {
    event.stopPropagation();
  }
}
