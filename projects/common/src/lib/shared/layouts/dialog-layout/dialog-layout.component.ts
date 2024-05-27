import { ChangeDetectionStrategy, Component } from '@angular/core';

/** Dialog layout component. */
@Component({
  selector: 'knc-dialog-layout',
  standalone: true,
  templateUrl: './dialog-layout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./dialog-layout.component.css'],
})
export class DialogLayoutComponent {}
