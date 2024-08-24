import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { RouterOutlet } from '@angular/router';
import { FlatControlsOf } from '@knb/core/utils/types/controls-of';
import { InputComponent } from '@knb/shared/components/inputs/input/input.component';
import { LabelComponent } from '@knb/shared/components/label/label.component';
import { Editor, NGX_EDITOR_CONFIG_TOKEN, NgxEditorModule, Toolbar } from 'ngx-editor';
import { NGX_EDITOR_CONFIG, NGX_EDITOR_TOOLBAR_CONFIG } from './ngx-editor.config';

type BlogCreationForm = FlatControlsOf<{
  readonly title: string;
  readonly content: string;
}>;

/** New blog component. */
@Component({
  selector: 'knw-new-blog',
  standalone: true,
  templateUrl: './new-blog.component.html',
  imports: [RouterOutlet, ReactiveFormsModule, LabelComponent, InputComponent, MatButtonModule, NgxEditorModule],
  providers: [{ provide: NGX_EDITOR_CONFIG_TOKEN, useValue: NGX_EDITOR_CONFIG }],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './new-blog.component.scss',
})
export class NewBlogComponent implements OnInit, OnDestroy {
  private readonly fb = inject(NonNullableFormBuilder);

  protected editor: Editor | null = null;
  protected toolbar: Toolbar = NGX_EDITOR_TOOLBAR_CONFIG;

  protected readonly newBlogForm = this.initializeForm();

  /** @inheritdoc */
  public ngOnInit(): void {
    this.editor = this.initializeEditor();
  }

  /** @inheritdoc */
  public ngOnDestroy(): void {
    if (this.editor == null) {
      return;
    }
    this.editor.destroy();
  }

  private initializeEditor(): Editor {
    return new Editor();
  }

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
