import { Component } from '@angular/core';
import { AuthService } from '../_services/auth.service'

@Component({
  selector: 'app-login',
  template: `
    <form *ngIf="!isLoggedIn()" (ngSubmit)="onSubmit()">
      <input type="text" [(ngModel)]="username" name="username" placeholder="Username" required>
      <input type="password" [(ngModel)]="password" name="password" placeholder="Password" required>
      <button type="submit">Login</button>
    </form>
    <div *ngIf="isLoggedIn()">
      Welcome, {{ getFullName() }}!
      <button (click)="logout()">Logout</button>
    </div>
    <div *ngIf="message">{{ message }}</div>
  `
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  message: string = '';

  constructor(private authService: AuthService) { }

  onSubmit() {
    this.authService.login(this.username, this.password).subscribe(
      response => {
        this.message = `Welcome, ${response.firstName} ${response.lastName}`;
      },
      error => this.message = error.error.message
    );
  }

  isLoggedIn(): boolean {
    return !!this.authService.getToken();
  }

  getFullName(): string {
    const firstName = localStorage.getItem('user_firstName');
    const lastName = localStorage.getItem('user_lastName');
    return `${firstName} ${lastName}`;
  }

  logout() {
    this.authService.logout();
    this.message = '';
  }
}
