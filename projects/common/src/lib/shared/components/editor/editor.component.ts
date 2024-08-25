import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { assertNonNullWithReturn } from '@knb/core/utils/assert-non-null';
import { controlProviderFor, SimpleValueAccessor } from '@knb/core/utils/rxjs/value-accessor';
import { QuillModule, QuillModules } from 'ngx-quill';
import Quill from 'quill';
import ImageResize from 'quill-image-resizor';
import { ImageUploaderModule } from './modules/image-uploader-module';

Quill.register('modules/imageResize', ImageResize);

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

  protected modules: QuillModules = {};
  private editor: Quill | null = null;

  public constructor() {
    super();
    this.modules = {
      imageResize: {},
    };
  }

  private addModules() {
    const nonNullableEditor = assertNonNullWithReturn(this.editor);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const toolbar = nonNullableEditor.getModule('toolbar') as any;
    toolbar.addHandler('image', () => this.imageUploaderModule.apply(nonNullableEditor));
  }

  protected onEditorCreated(quillInstance: Quill) {
    this.editor = quillInstance;
    this.addModules();
  }
}
