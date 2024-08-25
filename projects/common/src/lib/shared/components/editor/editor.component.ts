import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { controlProviderFor, SimpleValueAccessor } from '@knb/core/utils/rxjs/value-accessor';
import { QUILL_CONFIG_TOKEN, QuillModule } from 'ngx-quill';
import { QUILL_EDITOR_CONFIG } from './editor.config';

/** Editor component. */
@Component({
  selector: 'knc-editor',
  standalone: true,
  templateUrl: './editor.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [QuillModule, FormsModule],
  providers: [
    { provide: QUILL_CONFIG_TOKEN, useValue: QUILL_EDITOR_CONFIG },
    controlProviderFor(() => EditorComponent),
  ],
  styleUrl: './editor.component.scss',
})
export class EditorComponent extends SimpleValueAccessor<string> {}
