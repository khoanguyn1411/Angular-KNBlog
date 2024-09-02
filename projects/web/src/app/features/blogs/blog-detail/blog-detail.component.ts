import { ChangeDetectionStrategy, Component } from '@angular/core';

/** Blog detail component. */
@Component({
  selector: 'knw-blog-detail',
  standalone: true,
  templateUrl: './blog-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './blog-detail.component.scss',
})
export class BlogDetailComponent {}
