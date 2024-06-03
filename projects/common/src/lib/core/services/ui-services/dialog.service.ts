import { ComponentType } from '@angular/cdk/portal';
import { Injectable, inject } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

@Injectable({ providedIn: 'root' })
export class DialogService {
  private readonly dialogRef = inject(MatDialog);

  public open<TComponent, TData, TReturn = unknown>(
    component: ComponentType<TComponent>,
    data: TData,
    config?: MatDialogConfig<TData>,
  ) {
    this.dialogRef.open<TComponent, TData, TReturn>(component, {
      data,
      width: '450px',
      autoFocus: false,
      ...config,
    });
  }
}
