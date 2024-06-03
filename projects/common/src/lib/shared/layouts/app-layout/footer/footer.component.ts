import { ChangeDetectionStrategy, Component } from '@angular/core';

/** Footer component. */
@Component({
  selector: 'knc-footer',
  standalone: true,
  templateUrl: './footer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {}
