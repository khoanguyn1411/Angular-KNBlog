import { ChangeDetectionStrategy, Component, inject, input, NgZone, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { User } from '@knb/core/models/user';
import { controlProviderFor, SimpleValueAccessor } from '@knb/core/utils/rxjs/value-accessor';
import { AvatarComponent } from '../avatar/avatar.component';

/** Avatar uploader component. */
@Component({
  selector: 'knc-avatar-uploader',
  standalone: true,
  templateUrl: './avatar-uploader.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AvatarComponent, MatButtonModule, MatIconModule],
  providers: [controlProviderFor(() => AvatarUploaderComponent)],
  styleUrl: './avatar-uploader.component.scss',
})
export class AvatarUploaderComponent extends SimpleValueAccessor<File | null> {
  public readonly user = input.required<User | null>();

  protected readonly imageUrl = signal<string | ArrayBuffer | null>(null);

  private readonly zone = inject(NgZone);

  protected onClick() {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/png, image/gif, image/jpeg, image/webp');
    input.click();

    // Listen upload local image and save to server
    input.onchange = () => {
      this.zone.run(() => {
        const file = input.files?.[0];
        if (file == null) {
          return;
        }
        this.controlValue = file;
        const reader = new FileReader();
        reader.onload = () => {
          this.imageUrl.set(reader.result);
        };
        reader.readAsDataURL(file);
      });
    };
  }
}
