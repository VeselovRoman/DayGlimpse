import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-delete-dialog',
  template: `
    <h1 mat-dialog-title>Подтверждение удаления</h1>
    <div mat-dialog-content>
      <p>Вы уверены, что хотите удалить эту запись?</p>
    </div>
    <div mat-dialog-actions>
      <button mat-button (click)="onNoClick()">Нет</button>
      <button mat-button [mat-dialog-close]="true" cdkFocusInitial>Да</button>
    </div>
  `
})
export class ConfirmDialogComponent {
  constructor(public dialogRef: MatDialogRef<ConfirmDialogComponent>) { }

  onNoClick(): void {
    // Закрытие диалога без подтверждения
    this.dialogRef.close();
  }
}
