import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { FlatControlsOf } from '@knb/core/utils/types/controls-of';
import { InputComponent } from '@knb/shared/components/inputs/input/input.component';
import { LabelComponent } from '@knb/shared/components/label/label.component';
import { Editor, NgxEditorModule } from 'ngx-editor';

type BlogCreationForm = FlatControlsOf<{
  readonly title: string;
  readonly content: string;
}>;

/** New blog component. */
@Component({
  selector: 'knw-new-blog',
  standalone: true,
  templateUrl: './new-blog.component.html',
  imports: [RouterOutlet, NgxEditorModule, ReactiveFormsModule, LabelComponent, InputComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './new-blog.component.scss',
})
export class NewBlogComponent implements OnInit, OnDestroy {
  private readonly fb = inject(NonNullableFormBuilder);

  protected editor: Editor | null = null;
  protected html = '';
  protected readonly newBlogForm = this.initializeForm();

  /** @inheritdoc */
  public ngOnInit(): void {
    this.editor = new Editor();
  }

  /** @inheritdoc */
  public ngOnDestroy(): void {
    if (this.editor == null) {
      return;
    }
    this.editor.destroy();
  }

  private initializeForm(): FormGroup<BlogCreationForm> {
    return this.fb.group({
      title: this.fb.control('', [Validators.required]),
      content: this.fb.control('', [Validators.required]),
    });
  }
}
