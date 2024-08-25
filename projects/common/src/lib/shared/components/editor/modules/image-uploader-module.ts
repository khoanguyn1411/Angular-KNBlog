/* eslint-disable @typescript-eslint/ban-ts-comment */
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { UploadApiService } from '@knb/core/services/api-services/upload-api.service';
import { toggleExecutionState } from '@knb/core/utils/rxjs/toggle-execution-state';
import QuillType from 'quill';
import { defer, Observable, of, switchMap } from 'rxjs';

// Reference: https://github.com/KillerCodeMonkey/ngx-quill/issues/89
@Injectable({ providedIn: 'root' })
export class ImageUploaderModule {
  private editor: QuillType | null = null;

  private readonly uploadService = inject(UploadApiService);

  public readonly isUploadingImageSignal = signal(false);

  public readonly isUploadingImage = computed(() => this.isUploadingImageSignal());

  private getPosition(): { index: number } | null {
    if (this.editor == null) {
      throw new Error('No editor appeared.');
    }
    return this.editor?.getSelection() as { index: number } | null;
  }

  private insertToEditor(url: string): Observable<void> {
    return defer(() => {
      const position = this.getPosition();
      this.editor?.insertEmbed(position == null ? 0 : position.index, 'image', url);
      return of(undefined);
    });
  }

  private selectLocalImage(): void {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/png, image/gif, image/jpeg, image/webp');
    input.click();

    // Listen upload local image and save to server
    input.onchange = () => {
      const file = input.files?.[0];
      if (file == null) {
        return;
      }
      this.uploadService
        .uploadImage({ file })
        .pipe(
          toggleExecutionState(this.isUploadingImageSignal),
          switchMap((result) => this.insertToEditor(result.viewUrl)),
        )
        .subscribe();
    };
  }

  // Need this effect to trigger loading state. Not sure why.
  private updateStateImageEffect = effect(() => {
    this.isUploadingImage();
  });

  public apply(editor: QuillType) {
    this.editor = editor;
    this.selectLocalImage();
  }
}
