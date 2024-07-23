import { Component, EventEmitter, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../_services/account.service';
import { BranchService } from '../_services/branch.service';
import { Branch } from '../_models/branch';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';


@Component({
  selector: 'app-register-form',
  templateUrl: './registration-form.component.html',
  styleUrls: ['./registration-form.component.css']
})
export class RegistrationFormComponent {
  registerForm: FormGroup
  model: any = {};
  branches: Branch[] = [];
  branchesLoaded = false;

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private branchService: BranchService,
    private toaster: ToastrService
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.loadBranches();
  }

  initializeForm() {
    this.registerForm = this.fb.group({
      Agentname: ['', Validators.required],
      Password: ['', [Validators.required, Validators.minLength(4)]],
      Branch: [null, Validators.required],
      City: ['', Validators.required]
    });
  }

  register() {
    if (this.registerForm.valid) {
      let formData = {
        ...this.registerForm.value,
        BranchId: this.registerForm.value.Branch.id
      };
      delete formData.Branch;
  
      this.accountService.register(formData).subscribe({
        next: response => {
          console.log('Registration successful');
          // действие после успешной регистрации
        },
        error: error => this.toaster.error(error.error)
      });
    } else {
      this.toaster.error('Please fill all required fields correctly.');
    }
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
}
