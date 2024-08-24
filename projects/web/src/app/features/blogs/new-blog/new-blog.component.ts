import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { RouterOutlet } from '@angular/router';
import { FlatControlsOf } from '@knb/core/utils/types/controls-of';
import { EditorComponent } from '@knb/shared/components/editor/editor.component';
import { InputComponent } from '@knb/shared/components/inputs/input/input.component';
import { LabelComponent } from '@knb/shared/components/label/label.component';

type BlogCreationForm = FlatControlsOf<{
  readonly title: string;
  readonly content: string;
}>;

/** New blog component. */
@Component({
  selector: 'knw-new-blog',
  standalone: true,
  templateUrl: './new-blog.component.html',
  imports: [RouterOutlet, ReactiveFormsModule, LabelComponent, InputComponent, MatButtonModule, EditorComponent],

  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './new-blog.component.scss',
})
export class NewBlogComponent {
  private readonly fb = inject(NonNullableFormBuilder);

  protected readonly newBlogForm = this.initializeForm();

  private initializeForm(): FormGroup<BlogCreationForm> {
    return this.fb.group({
      title: this.fb.control('', [Validators.required]),
      content: this.fb.control('', [Validators.required]),
    });
  }

  protected onSubmit(): void {
    this.newBlogForm.markAllAsTouched();
  }
}
