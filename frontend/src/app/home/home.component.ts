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

  }

  registerToggle() {
    this.registerMode = !this.registerMode;
  }


  cancelRegisterMode(event: boolean) {
    this.registerMode = event;
  }

}
