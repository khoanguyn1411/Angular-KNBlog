import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { RouterOutlet } from '@angular/router';
import { BlogCreation } from '@knb/core/models/blog';
import { BlogsApiService } from '@knb/core/services/api-services/blogs-api.service';
import { toggleExecutionState } from '@knb/core/utils/rxjs/toggle-execution-state';
import { FlatControlsOf } from '@knb/core/utils/types/controls-of';
import { EditorComponent } from '@knb/shared/components/editor/editor.component';
import { InputComponent } from '@knb/shared/components/inputs/input/input.component';
import { TextareaComponent } from '@knb/shared/components/inputs/textarea/textarea.component';
import { LabelComponent } from '@knb/shared/components/label/label.component';

type BlogCreationForm = FlatControlsOf<BlogCreation>;

/** New blog component. */
@Component({
  selector: 'knw-new-blog',
  standalone: true,
  templateUrl: './new-blog.component.html',
  imports: [
    RouterOutlet,
    ReactiveFormsModule,
    LabelComponent,
    InputComponent,
    MatButtonModule,
    EditorComponent,
    TextareaComponent,
  ],

  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './new-blog.component.scss',
})
export class NewBlogComponent {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly blogsApiService = inject(BlogsApiService);

  protected readonly isCreatingPost = signal(false);

  protected readonly newBlogForm = this.initializeForm();

  private initializeForm(): FormGroup<BlogCreationForm> {
    return this.fb.group<BlogCreationForm>({
      title: this.fb.control('', [Validators.required]),
      content: this.fb.control('', [Validators.required]),
      summary: this.fb.control('', [Validators.required]),
      bannerUrl: this.fb.control(null),
    });
  }

  protected onSubmit(): void {
    this.newBlogForm.markAllAsTouched();
    this.blogsApiService
      .createBlog(this.newBlogForm.getRawValue())
      .pipe(toggleExecutionState(this.isCreatingPost))
      .subscribe();
  }
}
