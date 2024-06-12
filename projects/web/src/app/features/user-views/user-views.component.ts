import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppLayoutComponent } from '@knb/shared/layouts/app-layout/app-layout.component';

/** User views component. */
@Component({
  selector: 'knw-user-views',
  standalone: true,
  templateUrl: './user-views.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, AppLayoutComponent],
  styleUrls: ['./user-views.component.scss'],
})
export class UserViewsComponent {}
