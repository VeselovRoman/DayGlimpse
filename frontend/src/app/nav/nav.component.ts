import { Component, inject, OnInit } from '@angular/core';
import { AccountService } from '../_services/account.service';
import { Router } from '@angular/router';
import { Agent } from '../_models/agent';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  accountService = inject(AccountService);
  toasterService = inject(ToastrService);
  router = inject(Router);
  model: any = {};
  currentAgent: Agent | null = null;

  constructor () {}

  // Используем ngOnInit для подписки на изменения currentAgent
  ngOnInit() {
    // Подписка на текущего агента
    this.accountService.currentAgent$.subscribe(agent => {
      this.currentAgent = agent;
    });
  }
  
  // Метод логина
  login() {
    this.accountService.login(this.model).subscribe({
      next: response => {
        // Обновляем model с данными ответа
        this.model = response;
      },
      error: error => this.toasterService.error(error.error)
    });
  }

  // Метод логаута
  logout() {
    this.accountService.logout();
    const currentUrl = this.router.url;
    // Перенаправляем на главную страницу, если текущий URL не '/'
    if (currentUrl !== '/') {
      this.router.navigate(['/']);
    }
  }
}
