import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { MainComponent } from './main/main.component';

/** Layout component. */
@Component({
  selector: 'knc-layout',
  standalone: true,
  templateUrl: './layout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./layout.component.css'],
  imports: [FooterComponent, HeaderComponent, MainComponent]
})
export class LayoutComponent {

}
