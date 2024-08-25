import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, RouterLink } from '@angular/router';
import { DialogService } from '@knb/core/services/ui-services/dialog.service';
import { UserService } from '@knb/core/services/ui-services/user.service';
import {
  AuthenticationDialogComponent,
  AuthenticationDialogData,
} from '@knb/shared/components/authentication/authentication-dialog.component';
import { SkeletonDirective } from '@knb/shared/directives/skeleton.directive';
import { injectWebAppRoutes } from 'projects/web/src/shared/web-route-paths';
import { GlobalSearchComponent } from './global-search/global-search.component';
import { ThemeSettingsComponent } from './theme-settings/theme-settings.component';
import { UserOptionsComponent } from './user-options/user-options.component';

/** Header component. */
@Component({
  selector: 'knc-header',
  standalone: true,
  templateUrl: './header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./header.component.scss'],
  imports: [
    MatButtonModule,
    UserOptionsComponent,
    MatIconModule,
    GlobalSearchComponent,
    SkeletonDirective,
    MatTooltipModule,
    ThemeSettingsComponent,
    RouterLink,
  ],
})
export class HeaderComponent {
  private readonly dialogService = inject(DialogService);
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);

  protected readonly routes = injectWebAppRoutes();

  protected readonly isAuthorized = toSignal(this.userService.isAuthorized$);
  protected readonly isCurrentUserFetching = this.userService.isUserFetching;

  private openAuthenticationDialog(data: AuthenticationDialogData) {
    this.dialogService.open<AuthenticationDialogComponent, AuthenticationDialogData>(
      AuthenticationDialogComponent,
      data,
    );
  }

  protected onSignIn() {
    this.openAuthenticationDialog({ state: 'signIn' });
  }

  protected onSignUp() {
    this.openAuthenticationDialog({ state: 'signUp' });
  }

  protected onNewBlogCreate() {
    this.router.navigateByUrl(this.routes.blogs.children.newBlog.url);
  }
}
