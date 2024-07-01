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
      })
    )
  }

  setCurrentUser(agent: Agent) {
    localStorage.setItem('agent', JSON.stringify(agent));
  }

  login(model: any) {
    return this.http.post<Agent>(this.baseUrl + 'agent/login', model).pipe(
      map(agent => {
        if (agent) {
          localStorage.setItem('agent', JSON.stringify(agent));
          this.currentAgent.set(agent)
        }
      })
    );
  }

  logout() {
    localStorage.removeItem('agent');
    this.currentAgent.set(null);
  }

  getDecodedToken(token: string) {
    return JSON.parse(atob(token.split('.')[1]))
  }

}
