import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute } from '@angular/router';
import { UploadResult } from '@knb/core/models/upload-result';
import { User, UserUpdate } from '@knb/core/models/user';
import { UploadApiService } from '@knb/core/services/api-services/upload-api.service';
import { UserApiService } from '@knb/core/services/api-services/user-api.service';
import { PlatformService } from '@knb/core/services/ui-services/platform.service';
import { SeoService } from '@knb/core/services/ui-services/seo.service';
import { SnackbarService } from '@knb/core/services/ui-services/snackbar.service';
import { UserService } from '@knb/core/services/ui-services/user.service';
import { assertNonNull } from '@knb/core/utils/assert-non-null';
import { filterNull } from '@knb/core/utils/rxjs/filter-null';
import { toggleExecutionState } from '@knb/core/utils/rxjs/toggle-execution-state';
import { FlatControlsOf } from '@knb/core/utils/types/controls-of';
import { AvatarUploaderComponent } from '@knb/shared/components/avatar-uploader/avatar-uploader.component';
import { InputComponent } from '@knb/shared/components/inputs/input/input.component';
import { LabelComponent } from '@knb/shared/components/label/label.component';
import { LoadingDirective } from '@knb/shared/directives/loading.directive';
import { USER_ID_PARAM } from 'projects/web/src/shared/web-route-paths';
import { BehaviorSubject, combineLatestWith, map, Observable, of, shareReplay, switchMap, tap } from 'rxjs';

type InitUserUpdateForm = Pick<UserUpdate, 'firstName' | 'lastName'> & {
  readonly imageFile: File | null;
};

type UserUpdateForm = FlatControlsOf<InitUserUpdateForm>;

/** User detail component. */
@Component({
  selector: 'knw-user-detail',
  standalone: true,
  templateUrl: './user-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AvatarUploaderComponent,
    InputComponent,
    ReactiveFormsModule,
    LabelComponent,
    MatButtonModule,
    LoadingDirective,
  ],
  styleUrl: './user-detail.component.scss',
})
export class UserDetailComponent implements OnInit {
  private readonly userService = inject(UserService);
  private readonly userApiService = inject(UserApiService);
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  private readonly snackbarService = inject(SnackbarService);
  private readonly route = inject(ActivatedRoute);
  private readonly uploadApiService = inject(UploadApiService);
  private readonly seoService = inject(SeoService);

  private readonly refreshUserProfileIndicator$ = new BehaviorSubject({});
  private readonly userId$ = this.createUserIdStream();

  protected readonly currentUser = toSignal(this.userService.currentUser$);
  protected readonly isUpdatingUser = signal(false);
  protected readonly userForm = this.initializeForm();
  protected readonly userFormSignal = toSignal(this.userForm.valueChanges);
  protected readonly isPlatformBrowser = inject(PlatformService).isBrowserOnly;

  protected readonly userDetail$ = this.initializeUserDetail();
  protected readonly userDetail = toSignal(this.userDetail$);

  protected readonly isSelf = computed(() => {
    return this.currentUser()?.id === this.userDetail()?.id;
  });

  public ngOnInit(): void {
    this.userDetail$
      .pipe(
        tap((userDetail) => {
          this.seoService.addTitle(`Profile | ${userDetail.fullName}`);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

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
    this.createUpdateUserInfoSources(formValue, userDetail)
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

  private createUpdateUserInfoSources(formValue: InitUserUpdateForm, userDetail: User): Observable<void> {
    return of(formValue.imageFile).pipe(
      switchMap((imageFile) => {
        if (imageFile != null) {
          return this.uploadImage(formValue.imageFile).pipe(
            switchMap((uploadResult) =>
              this.userApiService.updateUser(userDetail.id, {
                firstName: formValue.firstName,
                lastName: formValue.lastName,
                pictureUrl: uploadResult.viewUrl,
              }),
            ),
          );
        }
        return this.userApiService.updateUser(userDetail.id, {
          firstName: formValue.firstName,
          lastName: formValue.lastName,
          pictureUrl: this.userDetail()?.pictureUrl ?? null,
        });
      }),
      map(() => undefined),
    );
  }

  private uploadImage(file: File | null): Observable<UploadResult> {
    assertNonNull(file);
    return this.uploadApiService.uploadImage({ file });
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
      imageFile: this.fb.control(null),
    });
  }

  private fillFormEffect = effect(() => {
    this.userForm.patchValue({
      firstName: this.userDetail()?.firstName,
      lastName: this.userDetail()?.lastName,
      imageFile: null,
    });
  });

  private setDisabledStateEffect = effect(() => {
    if (!this.isSelf()) {
      this.userForm.disable();
    } else {
      this.userForm.enable();
    }
  });
}
