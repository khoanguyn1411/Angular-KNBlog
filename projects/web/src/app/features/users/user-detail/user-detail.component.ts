import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { UserCreation } from '@knb/core/models/user';
import { UserService } from '@knb/core/services/ui-services/user.service';
import { FlatControlsOf } from '@knb/core/utils/types/controls-of';
import { AvatarComponent } from '@knb/shared/components/avatar/avatar.component';
import { InputComponent } from '@knb/shared/components/inputs/input/input.component';
import { LabelComponent } from '@knb/shared/components/label/label.component';

type UserCreationForm = FlatControlsOf<UserCreation>;

/** User detail component. */
@Component({
  selector: 'knw-user-detail',
  standalone: true,
  templateUrl: './user-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AvatarComponent, InputComponent, ReactiveFormsModule, LabelComponent, MatButtonModule],
  styleUrl: './user-detail.component.scss',
})
export class UserDetailComponent {
  private readonly userService = inject(UserService);
  private readonly fb = inject(NonNullableFormBuilder);

  protected readonly currentUser = toSignal(this.userService.currentUser$);
  protected readonly isUpdatingUser = signal(false);
  protected readonly userForm = this.initializeForm();
  protected readonly userFormSignal = toSignal(this.userForm.valueChanges);

  protected onSubmit(): void {
    this.userForm.markAllAsTouched();
    if (this.userForm.invalid) {
      return;
    }
    const formValue = this.userForm.getRawValue();
  }

  private initializeForm(): FormGroup<UserCreationForm> {
    return this.fb.group<UserCreationForm>({
      firstName: this.fb.control('', [Validators.required]),
      lastName: this.fb.control('', [Validators.required]),
      pictureUrl: this.fb.control(''),
    });
  }

  private fillFormEffect = effect(() => {
    this.userForm.patchValue({
      firstName: this.currentUser()?.firstName,
      lastName: this.currentUser()?.lastName,
      pictureUrl: this.currentUser()?.pictureUrl,
    });
  });
}
