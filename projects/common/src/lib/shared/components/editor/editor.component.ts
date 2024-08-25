import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { assertNonNullWithReturn } from '@knb/core/utils/assert-non-null';
import { controlProviderFor, SimpleValueAccessor } from '@knb/core/utils/rxjs/value-accessor';
import { EditorChangeContent, EditorChangeSelection, QuillModule } from 'ngx-quill';
import QuillType from 'quill';
import { ImageUploaderModule } from './modules/image-uploader-module';

/** Editor component. */
@Component({
  selector: 'knc-editor',
  standalone: true,
  templateUrl: './editor.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [QuillModule, FormsModule],
  providers: [controlProviderFor(() => EditorComponent)],
  styleUrl: './editor.component.scss',
})
export class EditorComponent extends SimpleValueAccessor<string> {
  private readonly imageUploaderModule = inject(ImageUploaderModule);

  private editor: QuillType | null = null;

  private addAndUpdateModules() {
    const nonNullableEditor = assertNonNullWithReturn(this.editor);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const toolbar = nonNullableEditor.getModule('toolbar') as any;
    toolbar.addHandler('image', () => this.imageUploaderModule.apply(nonNullableEditor));
  }

  protected onEditorCreated(quillInstance: QuillType) {
    this.editor = quillInstance;
    this.addAndUpdateModules();
  }

  protected onEditorChange(event: EditorChangeContent | EditorChangeSelection) {
    this.editor = event.editor;
    this.addAndUpdateModules();
  }
}
