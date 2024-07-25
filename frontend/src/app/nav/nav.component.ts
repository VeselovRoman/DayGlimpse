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

  constructor (public dialog: MatDialog) {}

  ngOnInit() {}
 
  // Метод логина
  login() {
    this.authService.login(this.model.username, this.model.password).subscribe({
      next: response => {
        this.model = response;
        this.router.navigate(['/']);
      },
      error: error => this.toasterService.error('Неверный логин или пароль')
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
    const username = this.authService.getUsername();
    if (!username) return;

    this.agentService.getAgentByUsername(username).subscribe(agent => {
      const dialogRef = this.dialog.open(AgentDialogComponent, {
        width: '400px',
        data: { agent }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.toasterService.success('Agent updated successfully');
        }
      });
    });
  }
}
