import { HttpClient } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  http = inject(HttpClient);
  registerMode = false;
  users: any;

  constructor() { }

  ngOnInit(): void {
    this.getAgents()
  }

  registerToggle() {
    this.registerMode = !this.registerMode;
  }


  cancelRegisterMode(event: boolean) {
    this.registerMode = event;
  }

  getAgents() {
    this.http.get('https://localhost:5001/api/agents').subscribe({
      next: response => this.users = response,
      error: error => console.log(error),
      complete: () => console.log('Request has completed')
    })
  }
}
