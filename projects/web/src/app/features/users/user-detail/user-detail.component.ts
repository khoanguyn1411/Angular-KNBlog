import { ChangeDetectionStrategy, Component, DestroyRef, effect, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute } from '@angular/router';
import { User, UserUpdate } from '@knb/core/models/user';
import { UserApiService } from '@knb/core/services/api-services/user-api.service';
import { SnackbarService } from '@knb/core/services/ui-services/snackbar.service';
import { UserService } from '@knb/core/services/ui-services/user.service';
import { filterNull } from '@knb/core/utils/rxjs/filter-null';
import { toggleExecutionState } from '@knb/core/utils/rxjs/toggle-execution-state';
import { FlatControlsOf } from '@knb/core/utils/types/controls-of';
import { AvatarComponent } from '@knb/shared/components/avatar/avatar.component';
import { InputComponent } from '@knb/shared/components/inputs/input/input.component';
import { LabelComponent } from '@knb/shared/components/label/label.component';
import { LoadingDirective } from '@knb/shared/directives/loading.directive';
import { USER_ID_PARAM } from 'projects/web/src/shared/web-route-paths';
import { BehaviorSubject, combineLatestWith, map, Observable, shareReplay, switchMap, tap } from 'rxjs';

type UserUpdateForm = FlatControlsOf<UserUpdate>;

/** User detail component. */
@Component({
  selector: 'knw-user-detail',
  standalone: true,
  templateUrl: './user-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AvatarComponent, InputComponent, ReactiveFormsModule, LabelComponent, MatButtonModule, LoadingDirective],
  styleUrl: './user-detail.component.scss',
})
export class UserDetailComponent {
  private readonly userService = inject(UserService);
  private readonly userApiService = inject(UserApiService);
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  private readonly snackbarService = inject(SnackbarService);
  private readonly route = inject(ActivatedRoute);
  private readonly refreshUserProfileIndicator$ = new BehaviorSubject({});
  private readonly userId$ = this.createUserIdStream();

  protected readonly currentUser = toSignal(this.userService.currentUser$);
  protected readonly isUpdatingUser = signal(false);
  protected readonly userForm = this.initializeForm();
  protected readonly userFormSignal = toSignal(this.userForm.valueChanges);

  protected readonly userDetail$ = this.initializeUserDetail();
  protected readonly userDetail = toSignal(this.userDetail$);

  protected onSubmit(): void {
    this.userForm.markAllAsTouched();
    if (this.userForm.invalid) {
      return;
    }
    const formValue = this.userForm.getRawValue();
    const userDetail = this.userDetail();
    if (userDetail == null) {
      return;
    }
    this.userApiService
      .updateUser(userDetail.id, formValue)
      .pipe(
        tap(() => {
          if (this.currentUser()?.id === userDetail.id) {
            this.userService.refreshUserProfile();
          }
          this.refreshPage();
          this.snackbarService.notify({ text: 'Update user information successfully', type: 'success' });
        }),
        toggleExecutionState(this.isUpdatingUser),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  private refreshPage() {
    this.refreshUserProfileIndicator$.next({});
  }

  private createUserIdStream(): Observable<User['id'] | null> {
    return this.route.paramMap.pipe(
      map((params) => params.get(USER_ID_PARAM)),
      shareReplay({ refCount: true, bufferSize: 1 }),
    );
  }

  private initializeUserDetail() {
    return this.userId$.pipe(
      combineLatestWith(this.refreshUserProfileIndicator$),
      map(([userId]) => userId),
      filterNull(),
      switchMap((userId) => this.userApiService.getUserById(userId)),
    );
  }

  private initializeForm(): FormGroup<UserUpdateForm> {
    return this.fb.group<UserUpdateForm>({
      firstName: this.fb.control('', [Validators.required]),
      lastName: this.fb.control('', [Validators.required]),
      pictureUrl: this.fb.control(''),
    });
  }

  private fillFormEffect = effect(() => {
    this.userForm.patchValue({
      firstName: this.userDetail()?.firstName,
      lastName: this.userDetail()?.lastName,
      pictureUrl: this.userDetail()?.pictureUrl,
    });
  });
}
