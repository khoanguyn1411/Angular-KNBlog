import { ChangeDetectionStrategy, Component } from '@angular/core';

/** Main component. */
@Component({
  selector: 'knc-main',
  standalone: true,
  templateUrl: './main.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./main.component.css']
})
export class MainComponent {

}
