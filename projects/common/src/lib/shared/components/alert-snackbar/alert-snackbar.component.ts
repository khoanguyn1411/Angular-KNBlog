import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { AlertComponent } from '../alert/alert.component';

export type SnackBarData = {
  readonly text: string | null;
  readonly type: 'error' | 'warning' | 'info' | 'success';
};

/** Alert component. */
@Component({
  selector: 'knc-alert-snackbar',
  standalone: true,
  templateUrl: './alert-snackbar.component.html',
  imports: [MatIconModule, MatButtonModule, AlertComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./alert-snackbar.component.scss'],
})
export class AlertSnackbarComponent {
  private readonly snackbarData = inject<SnackBarData>(MAT_SNACK_BAR_DATA, {
    optional: true,
  });

  private readonly snackbarRef = inject(MatSnackBarRef);

  public readonly text = input<SnackBarData['text']>(this.snackbarData?.text ?? null);

  public readonly type = input<SnackBarData['type']>(this.snackbarData?.type ?? 'error');

  protected readonly isCalledFromSnackbar = computed(() => this.snackbarData != null);

  protected onDismissAlert() {
    this.snackbarRef.dismiss();
  }
}
