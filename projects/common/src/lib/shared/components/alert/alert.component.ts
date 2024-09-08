import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export type SnackBarData = {
  readonly text: string | null;
  readonly type: 'error' | 'warning' | 'info' | 'success';
};

/** Alert component. */
@Component({
  selector: 'knc-alert',
  standalone: true,
  templateUrl: './alert.component.html',
  imports: [MatIconModule, MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./alert.component.scss'],
})
export class AlertComponent {
  public readonly text = input<SnackBarData['text']>(null);

  public readonly type = input<SnackBarData['type']>('error');

  public readonly isCalledFromSnackbar = input(false);
}
