import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Agent } from '../_models/agent';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl = 'https://localhost:5001/api/';
  currentAgent = signal<Agent | null>(null);

  constructor(private http: HttpClient) { }

  register(model: any) {
    return this.http.post<Agent>(this.baseUrl + 'agents/register', model).pipe(
      map(agent => {
        if (agent) {
          this.setCurrentUser(agent);
        }
        return agent;
      })
    )
  }

  setCurrentUser(agent: Agent) {
    localStorage.setItem('agent', JSON.stringify(agent));
  }

  login(model: any) {
    return this.http.post<Agent>(`${this.baseUrl}agents/login`, model).pipe(
      map(agent => {
        if (agent) {
          this.setCurrentUser(agent);
        }
        return agent;
      })
    );
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('agent') !== null;
  }

  logout() {
    localStorage.removeItem('agent');
  }

  currentAgentValue(): Agent | null {
    const storedAgent = localStorage.getItem('agent');
    return storedAgent ? JSON.parse(storedAgent) : null;
  }
  
  getDecodedToken(token: string) {
    return JSON.parse(atob(token.split('.')[1]))
  }

  getToken(): string | null {
    const agent = this.currentAgentValue();
    const token = agent?.token ?? null;

    console.log('Agent token:', token);

    return token;
  }
}
