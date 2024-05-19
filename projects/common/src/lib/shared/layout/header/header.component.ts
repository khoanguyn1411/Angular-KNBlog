import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from "@angular/material/button";

/** Header component. */
@Component({
  selector: 'knc-header',
  standalone: true,
  templateUrl: './header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./header.component.css'],
  imports: [MatButtonModule]
})
export class HeaderComponent {

}
