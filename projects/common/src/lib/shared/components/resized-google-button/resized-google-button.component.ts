import { GoogleSigninButtonModule } from '@abacritt/angularx-social-login';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Renderer2,
  inject,
  signal,
} from '@angular/core';

const GOOGLE_BUTTON_MAX_WIDTH = 400;
const GOOGLE_BUTTON_MIN_WIDTH = 200;

/** Resized-google-button component. */
@Component({
  selector: 'knc-resized-google-button',
  standalone: true,
  templateUrl: './resized-google-button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [GoogleSigninButtonModule],
  styleUrls: ['./resized-google-button.component.css'],
})
export class ResizedGoogleButtonComponent implements AfterViewInit {
  private renderer = inject(Renderer2);
  private elementRef = inject(ElementRef);

  protected width = signal(GOOGLE_BUTTON_MAX_WIDTH);

  public ngAfterViewInit(): void {
    const parentElement = this.renderer.parentNode(
      this.elementRef.nativeElement
    );
    const newWidth = this.getWidth(parentElement.offsetWidth);
    this.width.set(newWidth);
  }

  private getWidth(currentWidth: number) {
    if (this.width() > GOOGLE_BUTTON_MAX_WIDTH) {
      return GOOGLE_BUTTON_MAX_WIDTH;
    }
    if (this.width() < GOOGLE_BUTTON_MIN_WIDTH) {
      return GOOGLE_BUTTON_MIN_WIDTH;
    }
    return currentWidth;
  }
}
