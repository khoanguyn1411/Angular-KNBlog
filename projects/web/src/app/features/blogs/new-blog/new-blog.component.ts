import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterOutlet } from '@angular/router';
import { BlogCreation } from '@knb/core/models/blog';
import { BlogsApiService } from '@knb/core/services/api-services/blogs-api.service';
import { SnackbarService } from '@knb/core/services/ui-services/snackbar.service';
import { toggleExecutionState } from '@knb/core/utils/rxjs/toggle-execution-state';
import { FlatControlsOf } from '@knb/core/utils/types/controls-of';
import { EditorComponent } from '@knb/shared/components/editor/editor.component';
import { InputComponent } from '@knb/shared/components/inputs/input/input.component';
import { TextareaComponent } from '@knb/shared/components/inputs/textarea/textarea.component';
import { LabelComponent } from '@knb/shared/components/label/label.component';
import { LoadingDirective } from '@knb/shared/directives/loading.directive';
import { injectWebAppRoutes } from 'projects/web/src/shared/web-route-paths';
import { tap } from 'rxjs';

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
    LoadingDirective,
  ],

  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './new-blog.component.scss',
})
export class NewBlogComponent {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly blogsApiService = inject(BlogsApiService);
  private readonly snackbarService = inject(SnackbarService);
  private readonly router = inject(Router);
  private readonly routePaths = injectWebAppRoutes();

  protected readonly isCreatingPost = signal(false);

  protected readonly newBlogForm = this.initializeForm();

  private initializeForm(): FormGroup<BlogCreationForm> {
    return this.fb.group<BlogCreationForm>({
      title: this.fb.control('', [Validators.required]),
      content: this.fb.control('', [Validators.required]),
      summary: this.fb.control(''),
      bannerUrl: this.fb.control(null),
    });
  }

  /**
   * Get banner URL.
   * @param htmlString HTML string.
   */
  private getBannerUrl(htmlString: string): string | null {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlString;

    // Find the first image element
    const firstImage = tempDiv.querySelector('img');

    // Get the src attribute of the first image
    return firstImage ? firstImage.src : null;
  }

  protected onSubmit(): void {
    this.newBlogForm.markAllAsTouched();
    if (this.newBlogForm.invalid) {
      return;
    }
    const formValue = this.newBlogForm.getRawValue();
    this.blogsApiService
      .createBlog({
        ...formValue,
        bannerUrl: this.getBannerUrl(formValue.content),
      })
      .pipe(
        toggleExecutionState(this.isCreatingPost),
        tap(() => {
          this.snackbarService.notify({ type: 'success', text: 'Created new blog successfully.' });
          this.router.navigateByUrl(this.routePaths.root.url);
        }),
      )
      .subscribe();
  }
}
