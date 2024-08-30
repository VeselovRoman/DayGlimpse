import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = environment.apiUrl;
  private agentId: number;
  private authStatus = new BehaviorSubject<boolean>(this.hasToken());

  constructor(private http: HttpClient) { }

  login(username: string | undefined | null, password: string): Observable<any> {
 
    if (!username) {
      console.error('Username is undefined or null');
      return of(null);
    }

    const normalizedUsername = username.toLowerCase();

    return this.http.post<any>(`${this.baseUrl}Auth/login`, { username: normalizedUsername, password })
      .pipe(
        tap(response => {
          this.agentId = response.agentId;
          localStorage.setItem('agent_id', response.agentId.toString());
          localStorage.setItem('username', normalizedUsername);
          localStorage.setItem('auth_token', response.token);
          localStorage.setItem('user_firstName', response.firstName);
          localStorage.setItem('user_lastName', response.lastName);
          this.authStatus.next(true);  // Update the authentication status
        }),
        catchError(error => {
          // Handle login error
          console.error('Ошибка входа', error);
          return of(null);
        })
      );
  }

  logout() {
    localStorage.removeItem('agent_id');
    localStorage.removeItem('username');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_firstName');
    localStorage.removeItem('user_lastName');
    this.authStatus.next(false);
  }

  getToken(): string {
    return localStorage.getItem('auth_token') || '';
  }

  // Проверка на авторизацию
  isLoggedIn(): boolean {
    return !!this.getToken();
  }
  
  // Provide an observable for the authentication status
    getAuthStatus(): Observable<boolean> {
      return this.authStatus.asObservable();
    }

  getAgentId(): number {
    return this.agentId || +localStorage.getItem('agent_id')!;
  }

  getUsername(): string {
    return localStorage.getItem('username') || '';
  }

  getFirstName(): string {
    return localStorage.getItem('user_firstName') || '';
  }

  getLastName(): string {
    return localStorage.getItem('user_lastName') || '';
  }

  getFullName(): string {
    const firstName = localStorage.getItem('user_firstName');
    const lastName = localStorage.getItem('user_lastName');
    return `${firstName} ${lastName}`;
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('auth_token');
  }
}
