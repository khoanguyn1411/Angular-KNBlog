import { ChangeDetectionStrategy, Component } from '@angular/core';

/** User blogs component. */
@Component({
  selector: 'knw-user-blogs',
  standalone: true,
  templateUrl: './user-blogs.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './user-blogs.component.scss',
})
export class UserBlogsComponent {}
