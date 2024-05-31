import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AlertComponent } from '@knb/shared/components/alert/alert.component';
@Injectable({ providedIn: 'root' })
export class SnackbarService {
  private snackBar = inject(MatSnackBar);

  public open() {
    const snackbarRef = this.snackBar.openFromComponent(AlertComponent);
     // Retrieve the component instance
    //  snackbarRef.instance.text = "Test";
    //  snackbarRef.instance.type = "error";
  }
}
