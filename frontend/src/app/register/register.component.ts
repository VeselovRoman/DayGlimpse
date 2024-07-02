import { Component, EventEmitter, Output, inject, output } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '../_services/account.service';
import { Branch } from '../_models/branch';
import { BranchService } from '../_services/branch.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  //private accountService = inject(AccountService);
  //private branchService = inject(BranchService);
  cancelRegister = output<boolean>();
  model: any = {}
  branches: Branch[] = []; // массив для хранения списка филиалов
  selectedBranchId: number | null = null; // выбранный филиал
  branchesLoaded = false; // Переменная для отслеживания загрузки данных филиалов

  constructor(
    private accountService: AccountService,
    private branchService: BranchService
  ) {}

  ngOnInit(): void {
    //this.intializeForm();
    // Инициализация данных, если необходимо
    this.loadBranches(); // загрузка списка филиалов при инициализации компонента
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
    // Добавьте выбранный филиал к модели перед отправкой на сервер
    this.model.branchId = this.selectedBranchId;

    // Отправка данных на сервер для регистрации
    this.accountService.register(this.model).subscribe({
      next: response => {
        console.log(response);
        this.cancel();
      },
      error: error => console.log(error)
    })
   console.log(this.model)
  }

  cancel() {
    this.cancelRegister.emit(false);
  }

  loadBranches() {
    // Загрузка списка филиалов с сервера через сервис
    this.branchService.getBranches().subscribe({
      next: (branches: Branch[]) => {
        this.branches = branches;
        this.branchesLoaded = true; // Устанавливаем флаг загрузки данных
        console.log('Загруженные филиалы:', this.branches); // console.log внутрь функции next
      },
      error: error => console.error(error)
    });

  }

}