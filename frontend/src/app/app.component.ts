import { Component, OnInit, inject } from '@angular/core';
import { AccountService } from './_services/account.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  accountService = inject(AccountService);
  
  ngOnInit(): void {
    this.setCurrentAgent();
  }

  setCurrentAgent() {
    const userString = localStorage.getItem('agent');
    if (!userString) return;
    const agent = JSON.parse(userString);
    this.accountService.currentAgent.set(agent);
  }


}
