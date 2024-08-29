import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { assertNonNullWithReturn } from '@knb/core/utils/assert-non-null';
import { controlProviderFor, SimpleValueAccessor } from '@knb/core/utils/rxjs/value-accessor';
import { LoadingDirective } from '@knb/shared/directives/loading.directive';
import { EditorChangeContent, EditorChangeSelection, QuillModule, QuillModules } from 'ngx-quill';
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
  imports: [QuillModule, FormsModule, LoadingDirective, AsyncPipe],
  providers: [controlProviderFor(() => EditorComponent)],
  styleUrl: './editor.component.scss',
})
export class EditorComponent extends SimpleValueAccessor<string> {
  protected readonly imageUploaderModule = inject(ImageUploaderModule);
  private readonly changeDetectionStrategy = inject(ChangeDetectorRef);

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
    this.changeDetectionStrategy.markForCheck();
  }

  protected onEditorCreated(quillInstance: Quill) {
    this.editor = quillInstance;
    this.addModules();
  }

  protected onEditorChanged(changeContentEvent: EditorChangeContent | EditorChangeSelection) {
    if (changeContentEvent.event === 'text-change') {
      this.controlValue = changeContentEvent.html;
    }
  }
}
