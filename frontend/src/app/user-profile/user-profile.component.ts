import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AgentService } from '../_services/agent.service';
import { AuthService } from '../_services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  userProfileForm: FormGroup;
  branches: any[] = [];

  constructor(
    private fb: FormBuilder,
    private agentService: AgentService,
    private authService: AuthService,
    private toastr: ToastrService
  ) {
    this.userProfileForm = this.fb.group({
      id: [{ value: '', disabled: true }, Validators.required],
      login: [{ value: '', disabled: true }, Validators.required],
      firstName: [{ value: '', disabled: true }, Validators.required],
      lastName: [{ value: '', disabled: true }, Validators.required],
      city: ['', Validators.required],
      branchId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadUserProfile();
    this.loadBranches();
  }

  loadUserProfile(): void {
    const username = this.authService.getUsername();
    if (!username) {
      this.toastr.error('Не удалось получить данные пользователя');
      return;
    }

    this.agentService.getAgentByUsername(username).subscribe({
      next: (agent) => {
        this.userProfileForm.patchValue(agent);
      },
      error: () => {
        this.toastr.error('Ошибка при загрузке данных пользователя');
      }
    });
  }

  loadBranches(): void {
    this.agentService.getAllBranches().subscribe({
      next: (branches) => {
        this.branches = branches;
      },
      error: () => {
        this.toastr.error('Ошибка при загрузке филиалов');
      }
    });
  }

  saveUserProfile(): void {
    if (this.userProfileForm.invalid) {
      this.toastr.error('Пожалуйста, заполните все обязательные поля');
      return;
    }

    const updatedProfile = this.userProfileForm.getRawValue();
    this.agentService.updateAgent(updatedProfile).subscribe({
      next: () => {
        this.toastr.success('Профиль успешно обновлен');
      },
      error: () => {
        this.toastr.error('Ошибка при обновлении профиля');
      }
    });
  }
}
