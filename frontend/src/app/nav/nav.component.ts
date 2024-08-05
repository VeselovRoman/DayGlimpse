import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AgentDialogComponent } from '../agent-dialog/agent-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { AgentService } from '../_services/agent.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  authService = inject(AuthService);
  toasterService = inject(ToastrService);
  agentService = inject(AgentService);
  router = inject(Router);
  model: any = {};
  isLoggedIn: boolean = false;

  constructor (public dialog: MatDialog) {}

  ngOnInit() {
    this.authService.getAuthStatus().subscribe(status => {
      this.isLoggedIn = status;
    });
  }
 
  // Метод логина
  login() {
    this.authService.login(this.model.username, this.model.password).subscribe({
      next: response => {
        this.model = response;
        this.router.navigate(['/']);
      },
      error: error => {
        if (error.status === 401) {
          this.toasterService.error('Неверный логин или пароль');
        } else if (error.status === 0) {
          this.toasterService.error('Ошибка сети. Проверьте подключение к интернету.');
        } else {
          this.toasterService.error('Произошла ошибка. Попробуйте еще раз.');
        }
      }
    });
  }

  // Метод логаута
  logout() {
    this.authService.logout();
    const currentUrl = this.router.url;
    if (currentUrl !== '/') {
      this.router.navigate(['/']);
    }
  }
  
  editAgent() {
     this.router.navigate(['/profile']);
  }
}
