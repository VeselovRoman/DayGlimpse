import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../_services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService
  ) {}

  canActivate(): boolean {
    if (this.authService.isLoggedIn()) {
      return true; // Allow navigation
    } else {
     //this.router.navigate(['/']); // Redirect to login page
      return false; // Prevent navigation
    }
  }
}
