import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  signal,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

export type SnackBarData = {
  readonly text: string | null;
  readonly type: 'error' | 'warning' | 'info' | 'success';
};

/** Alert component. */
@Component({
  selector: 'knc-alert',
  standalone: true,
  templateUrl: './alert.component.html',
  imports: [MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./alert.component.scss'],
})
export class AlertComponent {
  private readonly snackbarData = inject<SnackBarData>(MAT_SNACK_BAR_DATA, {
    optional: true,
  });

  public readonly text = input<SnackBarData['text']>(
    this.snackbarData?.text ?? null,
  );

  public readonly type = input<SnackBarData['type']>(
    this.snackbarData?.type ?? 'error',
  );

  protected readonly isCalledFromSnackbar = signal(this.snackbarData != null);
}
