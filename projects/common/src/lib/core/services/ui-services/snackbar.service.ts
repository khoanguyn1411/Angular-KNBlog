import { Injectable, inject } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { AlertSnackbarComponent } from '@knb/shared/components/alert-snackbar/alert-snackbar.component';
import { SnackBarData } from '@knb/shared/components/alert/alert.component';
@Injectable({ providedIn: 'root' })
export class SnackbarService {
  private readonly snackBarRef = inject(MatSnackBar);

  public notify(data: SnackBarData, config?: MatSnackBarConfig<SnackBarData>) {
    this.snackBarRef.openFromComponent<AlertSnackbarComponent>(AlertSnackbarComponent, {
      data,
      panelClass: 'custom-notification',
      horizontalPosition: 'right',
      verticalPosition: 'top',
      duration: 2000,
      ...config,
    });
  }
}
