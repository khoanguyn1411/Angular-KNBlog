/* eslint-disable @typescript-eslint/ban-ts-comment */
import { inject, Injectable } from '@angular/core';
import { UploadApiService } from '@knb/core/services/api-services/upload-api.service';
import QuillType from 'quill';
import { catchError, defer, map, Observable, of, shareReplay, switchMap, tap, throwError } from 'rxjs';

type UploadedImageValue = {
  readonly url: string;
  readonly selectionIndex: number;
};

const placeholderImageUrl = 'https://miro.medium.com/v2/resize:fit:1260/1*ngNzwrRBDElDnf2CLF_Rbg.gif';

// Reference: https://github.com/KillerCodeMonkey/ngx-quill/issues/89
@Injectable({ providedIn: 'root' })
export class ImageUploaderModule {
  private editor: QuillType | null = null;

  private readonly uploadService = inject(UploadApiService);

  private getSelection(): { index: number } {
    if (this.editor == null) {
      throw new Error('No editor appeared.');
    }
    return this.editor?.getSelection() as { index: number };
  }

  private saveToServer(file: File): Observable<UploadedImageValue> {
    const selectionRange = this.getSelection();
    const startInsertLoadingImageEffect$ = defer(() => {
      return this.insertToEditor({
        url: placeholderImageUrl,
        selectionIndex: selectionRange.index,
      });
    });
    return startInsertLoadingImageEffect$.pipe(
      switchMap(() =>
        this.uploadService.uploadImage({ file }).pipe(
          shareReplay({ refCount: true, bufferSize: 1 }),
          tap(() => {
            this.editor?.deleteText(selectionRange.index, 1);
          }),
          catchError((error) => {
            this.editor?.deleteText(selectionRange.index, 1)
            return throwError(() => error);
          }),
        ),
      ),
      map((uploadResult) => ({ url: uploadResult.viewUrl, selectionIndex: selectionRange.index })),
    );
  }

  private insertToEditor({ url, selectionIndex }: UploadedImageValue): Observable<void> {
    return defer(() => {
      this.editor?.insertEmbed(selectionIndex, 'image', url);
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
      this.saveToServer(file)
        .pipe(switchMap((result) => this.insertToEditor(result)))
        .subscribe();
    };
  }

  public apply(editor: QuillType) {
    this.editor = editor;
    this.selectLocalImage();
  }
}
