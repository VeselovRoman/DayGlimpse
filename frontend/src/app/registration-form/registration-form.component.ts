import { Component, EventEmitter, Output } from '@angular/core';
import { AccountService } from '../_services/account.service';
import { BranchService } from '../_services/branch.service';
import { Branch } from '../_models/branch';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-register-form',
  templateUrl: './registration-form.component.html',
  styleUrls: ['./registration-form.component.css']
})
export class RegistrationFormComponent {
  registerForm: FormGroup
  branches: Branch[] = [];
  branchesLoaded = false;

  constructor(
    public dialogRef: MatDialogRef<RegistrationFormComponent>,
    private fb: FormBuilder,
    private accountService: AccountService,
    private branchService: BranchService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.loadBranches();
  }

  initializeForm() {
    this.registerForm = this.fb.group({
      AgentName: ['', Validators.required],
      Password: ['', [Validators.required, Validators.minLength(4)]],
      BranchId: [null, Validators.required],
      City: ['', Validators.required]
    });
  }

  register() {
    if (this.registerForm.valid) {
      this.accountService.register(this.registerForm.value).subscribe({
        next: response => {
          this.showSuccess ("Регистрация прошла успешно")
          this.dialogRef.close();
        },
        error: error => this.showError ("Ошибка во время регистарции. Попробуйте обновить страницу")
      });
    } else {
      this.showError ("Проверьте правильность заполнения полей")
    }
  }
   
  cancel() {
    this.dialogRef.close();  // Закрыть диалог при нажатии на кнопку "Отмена"
  }
  
  loadBranches() {
    this.branchService.getBranches().subscribe({
      next: (branches: Branch[]) => {
        this.branches = branches;
        this.branchesLoaded = true;
      },
      error: error => console.error(error)
    });
  }

  showSuccess(message: string) {
    this.snackBar.open(message, 'OK', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }

  showError(error: string) {
    this.snackBar.open(error, 'Закрыть', {
      duration: 3000,
      panelClass: ['red-snackbar']
    });
  }
}
