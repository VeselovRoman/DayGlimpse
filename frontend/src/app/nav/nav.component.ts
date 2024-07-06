import { Component, inject } from '@angular/core';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent {
  accountService = inject(AccountService);
  model: any = {};

  constructor () {}

  login() {
    this.accountService.login(this.model).subscribe({
      next: response => {
      },
      error: error => console.log(error)
    })
  }

  logout(){
    this.accountService.logout()
  }
}
