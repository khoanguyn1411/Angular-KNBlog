import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

/** Alert component. */
@Component({
  selector: 'knc-alert',
  standalone: true,
  templateUrl: './alert.component.html',
  imports: [MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent {
  public readonly text = input<string | null>(null)
  public readonly type = input<"error" | "warning" | "info">("error")
}