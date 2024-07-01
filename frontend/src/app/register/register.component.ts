import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  @Output() cancelRegister = new EventEmitter();
  model: any = {} 

  ngOnInit(): void {
    //this.intializeForm();
  }

  /*intializeForm() {
    this.registerForm = this.fb.group({
      username: ['',Validators.required],
      city: ['',Validators.required],
      branch: ['',Validators.required],
      password: ['', [Validators.required, 
        Validators.minLength(4), 
        Validators.maxLength(8)]],
      confirmPassword: ['', [Validators.required, this.matchValues('password')]]
    });
    this.registerForm.controls['password'].valueChanges.subscribe({
      next: () => this.registerForm.controls['confirmPassword'].updateValueAndValidity()
    })
  }

  matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl) => {
      return control.value === control.parent?.get(matchTo)?.value ? null : {notMatching: true}
    }
  }*/

  register() {
    /*const values = {...this.registerForm.value};
    this.accountService.register(values).subscribe({
      next: () => {
        this.router.navigateByUrl('/members')
      },
      error: error => {
        this.validationError = error
      }
    })*/
   console.log(this.model)
  }

  cancel() {
    this.cancelRegister.emit(false);
  }

}