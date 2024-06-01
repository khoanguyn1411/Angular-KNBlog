import { Injectable, inject } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import {
  AlertComponent,
  SnackBarData,
} from '@knb/shared/components/alert/alert.component';
@Injectable({ providedIn: 'root' })
export class SnackbarService {
  private snackBarRef = inject(MatSnackBar);

  public notify(data: SnackBarData, config?: MatSnackBarConfig<SnackBarData>) {
    this.snackBarRef.openFromComponent<AlertComponent>(AlertComponent, {
      data,
      panelClass: 'custom-notification',
      horizontalPosition: 'right',
      verticalPosition: 'top',
      duration: 2000,
      ...config,
    });
  }
}
