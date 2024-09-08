/* eslint-disable @typescript-eslint/ban-ts-comment */
import { computed, inject, Injectable, NgZone, signal } from '@angular/core';
import { UploadApiService } from '@knb/core/services/api-services/upload-api.service';
import { toggleExecutionState } from '@knb/core/utils/rxjs/toggle-execution-state';
import QuillType from 'quill';
import { defer, Observable, Observer, of, switchMap } from 'rxjs';

// Reference: https://github.com/KillerCodeMonkey/ngx-quill/issues/89
@Injectable({ providedIn: 'root' })
export class ImageUploaderModule {
  private editor: QuillType | null = null;

  private readonly uploadService = inject(UploadApiService);
  private readonly ngZone = inject(NgZone);

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
      const index = position == null ? 0 : position.index;
      this.editor?.insertEmbed(index, 'image', url);
      this.editor?.formatText(index, index + 1, 'width', '100%');
      return of(undefined);
    });
  }

  private selectLocalImage(observer: Observer<string | null>): void {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/png, image/gif, image/jpeg, image/webp');
    input.click();

    // Listen upload local image and save to server
    input.onchange = () => {
      const file = input.files?.[0];
      if (file == null) {
        observer.next(null);
        observer.complete();
        return;
      }
      this.uploadService
        .uploadImage({ file })
        .pipe(
          toggleExecutionState(this.isUploadingImageSignal),
          switchMap((result) => this.insertToEditor(result.viewUrl)),
        )
        .subscribe({
          next: () => {
            observer.next(this.editor?.getSemanticHTML() ?? null);
            observer.complete();
          },
        });
    };
  }

  public apply(editor: QuillType) {
    this.editor = editor;
    return new Observable<string | null>((observer) => {
      this.ngZone.run(() => this.selectLocalImage(observer));
    });
  }
}
