import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { controlProviderFor, SimpleValueAccessor } from '@knb/core/utils/rxjs/value-accessor';
import { Editor, NGX_EDITOR_CONFIG_TOKEN, NgxEditorModule, Toolbar } from 'ngx-editor';
import { NGX_EDITOR_CONFIG, NGX_EDITOR_TOOLBAR_CONFIG } from './ngx-editor.config';

/** Editor component. */
@Component({
  selector: 'knc-editor',
  standalone: true,
  templateUrl: './editor.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgxEditorModule, FormsModule],
  providers: [
    { provide: NGX_EDITOR_CONFIG_TOKEN, useValue: NGX_EDITOR_CONFIG },
    controlProviderFor(() => EditorComponent),
  ],
  styleUrl: './editor.component.css',
})
export class EditorComponent extends SimpleValueAccessor<string> implements OnInit, OnDestroy {
  protected editor: Editor | null = null;
  protected toolbar: Toolbar = NGX_EDITOR_TOOLBAR_CONFIG;

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
}
