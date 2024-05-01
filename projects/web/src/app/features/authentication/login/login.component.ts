import {
  GoogleSigninButtonModule,
  SocialAuthService,
  SocialLoginModule
} from '@abacritt/angularx-social-login';
import { AsyncPipe, CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, merge, tap } from 'rxjs';

@Component({
  selector: 'knw-login',
  standalone: true,
  imports: [CommonModule, GoogleSigninButtonModule, SocialLoginModule, AsyncPipe],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit {
  private authService = inject(SocialAuthService);

  private placeholderApi = 'https://jsonplaceholder.typicode.com/todos/1';

  private httpService = inject(HttpClient);

  protected result$: Observable<any>;

  protected user: any;
  protected accessToken: any;

  private destroyRef = inject(DestroyRef);

  public constructor() {
    this.result$ = this.httpService.get(this.placeholderApi).pipe(tap((data) => console.log({data})));
  }

  /** @inheritdoc */
  public ngOnInit(): void {
    merge(this.authService.authState.pipe(tap((user) => console.log({ user }))))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }
}
