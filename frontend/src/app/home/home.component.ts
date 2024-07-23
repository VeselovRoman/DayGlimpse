import { HttpClient } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { AccountService } from '../_services/account.service';
import { MatDialog } from '@angular/material/dialog';
import { RegistrationFormComponent } from '../registration-form/registration-form.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  http = inject(HttpClient);
  accountService = inject(AccountService);
  users: any;

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  openRegistrationDialog(): void {
    const dialogRef = this.dialog.open(RegistrationFormComponent, {
      width: '400px'
    });
  
  }

}
