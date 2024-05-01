import {
  GoogleLoginProvider,
  GoogleSigninButtonDirective,
  GoogleSigninButtonModule,
  SocialAuthService,
  SocialLoginModule
} from '@abacritt/angularx-social-login';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { merge, tap } from 'rxjs';

@Component({
  selector: 'knw-login',
  standalone: true,
  imports: [CommonModule, GoogleSigninButtonModule, SocialLoginModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit {
  private authService = inject(SocialAuthService);

  protected user: any;
  protected accessToken: any;

  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    merge(this.authService.authState.pipe(tap((user) => console.log({ user }))))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }
}
