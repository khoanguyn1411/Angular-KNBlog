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
    const newWidth =
      parentElement.offsetWidth > GOOGLE_BUTTON_MAX_WIDTH
        ? GOOGLE_BUTTON_MAX_WIDTH
        : parentElement.offsetWidth;
    this.width.set(newWidth);
  }
}
