import { Component, inject } from '@angular/core';
import { AccountService } from '../_services/account.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent {
  accountService = inject(AccountService);
  router = inject(Router);
  model: any = {};

  constructor () {}

  login() {
    console.log(this.model);
    this.accountService.login(this.model).subscribe({
      next: response => {
      },
      error: error => console.log(error)
    })
  }

  logout() {
    this.accountService.logout();
    // Проверяем текущий маршрут перед редиректом
    const currentUrl = this.router.url;
    if (currentUrl !== '/') {
      this.router.navigate(['/']);
    }
  }
}
