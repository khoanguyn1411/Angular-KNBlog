import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/** User views component. */
@Component({
  selector: 'knw-user-views',
  standalone: true,
  templateUrl: './user-views.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet],
  styleUrls: ['./user-views.component.scss'],
})
export class UserViewsComponent {}
