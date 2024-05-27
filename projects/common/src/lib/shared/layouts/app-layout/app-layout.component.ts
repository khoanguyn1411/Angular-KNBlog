import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { MainComponent } from './main/main.component';

/** App layout component. */
@Component({
  selector: 'knc-app-layout',
  standalone: true,
  templateUrl: './app-layout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./app-layout.component.scss'],
  imports: [FooterComponent, HeaderComponent, MainComponent],
})
export class AppLayoutComponent {}
