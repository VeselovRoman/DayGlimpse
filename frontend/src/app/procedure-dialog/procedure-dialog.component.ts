import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Procedure } from '../_models/procedures';

@Component({
  selector: 'app-procedure-dialog',
  templateUrl: './procedure-dialog.component.html',
  styleUrls: ['./procedure-dialog.component.css']
})
export class ProcedureDialogComponent {
  procedureForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ProcedureDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Procedure
  ) {
    this.procedureForm = this.fb.group({
      id: [data.id],
      name: [data.name, Validators.required],
    });
  }

  onSave(): void {
    if (this.procedureForm.valid) {
      this.dialogRef.close(this.procedureForm.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
