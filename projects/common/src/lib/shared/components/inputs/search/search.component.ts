import { ChangeDetectionStrategy, Component } from '@angular/core';

/** Search component. */
@Component({
  selector: 'knc-search',
  standalone: true,
  templateUrl: './search.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent {}
