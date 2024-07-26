import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { Respondent } from '../_models/respondent';
import { Branch } from '../_models/branch';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-respondent-dialog',
  templateUrl: './respondent-dialog.component.html',
  styleUrls: ['./respondent-dialog.component.css']
})
export class RespondentDialogComponent {
  branches: Branch[] = [];
  respondentForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<RespondentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { respondent: Respondent; branches: Branch[] }
  ) {
    // Заполнение данных
    this.branches = data.branches;
    this.initForm();
  }

  private initForm(): void {
    this.respondentForm = this.fb.group({
      name: [this.data.respondent.name, Validators.required],
      city: [this.data.respondent.city, Validators.required],
      branchId: [this.data.respondent.branchId, Validators.required]
    });
  }

  onSave(): void {
    if (this.respondentForm.valid) {
      console.log('Saving data:', this.data.respondent);
      this.dialogRef.close(this.respondentForm.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
