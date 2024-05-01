import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppConfig } from '@knb/core/services/app.config';

@Component({
  selector: 'knw-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {

	private readonly appConfigService = inject(AppConfig);

  constructor(){
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    console.log(this.appConfigService.apiUrl)
  }
}
