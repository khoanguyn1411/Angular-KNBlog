import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { RouterLink } from '@angular/router';
import { UserService } from '@knb/core/services/ui-services/user.service';
import { AvatarComponent } from '@knb/shared/components/avatar/avatar.component';
import { injectWebAppRoutes } from 'projects/web/src/shared/web-route-paths';
import { first } from 'rxjs';

/** User options component. */
@Component({
  selector: 'knc-user-options',
  standalone: true,
  templateUrl: './user-options.component.html',
  imports: [AvatarComponent, MatMenuModule, MatDividerModule, MatIconModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./user-options.component.scss'],
})
export class UserOptionsComponent {
  private readonly userService = inject(UserService);
  private readonly routePaths = injectWebAppRoutes();

  protected readonly currentUser = toSignal(this.userService.currentUser$);

  protected readonly yourBlogsUrl = computed(() => {
    const currentUserId = this.currentUser()?.id;
    if (currentUserId == null) {
      return '';
    }
    return this.routePaths.blogs.children.user.url({ userId: currentUserId });
  });

  protected readonly profileUrl = computed(() => {
    const currentUserId = this.currentUser()?.id;
    if (currentUserId == null) {
      return '';
    }
    return this.routePaths.users.children.detail.url({ userId: currentUserId });
  });

  protected onSignOut() {
    this.userService.logout().pipe(first()).subscribe();
  }
}
