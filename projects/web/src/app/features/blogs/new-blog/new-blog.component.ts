import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppLayoutComponent } from '@knb/shared/layouts/app-layout/app-layout.component';

/** New blog component. */
@Component({
  selector: 'knw-new-blog',
  standalone: true,
  templateUrl: './new-blog.component.html',
  imports: [RouterOutlet, AppLayoutComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './new-blog.component.css',
})
export class NewBlogComponent {}
