import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';

/** Users component. */
@Component({
  selector: 'knw-users',
  standalone: true,
  templateUrl: './users.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterModule],
  styleUrl: './users.component.scss',
})
export class UsersComponent {}
