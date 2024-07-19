import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Respondent } from '../_models/respondent';
import { Branch } from '../_models/branch';

@Component({
  selector: 'app-respondent-dialog',
  templateUrl: './respondent-dialog.component.html',
  styleUrls: ['./respondent-dialog.component.css']
})
export class RespondentDialogComponent {
  branches: Branch[] = []; // Этот массив нужно будет заполнить из родительского компонента

  constructor(
    public dialogRef: MatDialogRef<RespondentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { respondent: Respondent; branches: Branch[] }
  ) {
    // Заполнение данных
    this.branches = data.branches;
  }

  onSave(): void {
    this.dialogRef.close(this.data.respondent);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
