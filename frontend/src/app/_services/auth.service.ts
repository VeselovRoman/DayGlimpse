import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = environment.apiUrl;
  private agentId: number;

  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}Auth/login`, { username, password })
      .pipe(
        tap(response => {
          this.agentId = response.agentId;
          localStorage.setItem('id', response.agentId);
          localStorage.setItem('username', username);
          localStorage.setItem('auth_token', response.token);
          localStorage.setItem('user_firstName', response.firstName);
          localStorage.setItem('user_lastName', response.lastName);
        })
      );
  }

  logout() {
    localStorage.removeItem('agent_id');
    localStorage.removeItem('username');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_firstName');
    localStorage.removeItem('user_lastName');
  }

  getToken(): string {
    return localStorage.getItem('auth_token') || '';
  }

  // Проверка на авторизацию
  isLoggedIn(): boolean {
    return !!this.getToken();
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

}
