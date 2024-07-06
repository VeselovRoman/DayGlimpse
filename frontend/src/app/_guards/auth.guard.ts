import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AccountService } from '../_services/account.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private accountService: AccountService
  ) {}

  canActivate(): boolean {
    if (this.accountService.isLoggedIn()) {
      return true; // Allow navigation
    } else {
     //this.router.navigate(['/']); // Redirect to login page
      return false; // Prevent navigation
    }
  }
}
