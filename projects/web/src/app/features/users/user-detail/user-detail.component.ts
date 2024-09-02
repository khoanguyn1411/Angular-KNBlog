import { ChangeDetectionStrategy, Component } from '@angular/core';

/** User detail component. */
@Component({
  selector: 'knw-user-detail',
  standalone: true,
  templateUrl: './user-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './user-detail.component.scss',
})
export class UserDetailComponent {}
