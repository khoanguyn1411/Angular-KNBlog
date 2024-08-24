import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';

/** Blogs component. */
@Component({
  selector: 'knw-blogs',
  standalone: true,
  templateUrl: './blogs.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterModule],
  styleUrl: './blogs.component.css',
})
export class BlogsComponent {}
