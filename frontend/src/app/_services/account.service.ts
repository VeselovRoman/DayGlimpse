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
    console.log(agent);
    localStorage.setItem('agent', JSON.stringify(agent));
    this.currentAgent.set(agent)
  }

  login(model: any) {
    console.log(model);
    return this.http.post<Agent>(this.baseUrl + 'agents/login', model).pipe(
      map(agent => {
        if (agent) {
          this.setCurrentUser(agent)
        }
      })
    );
  }

  isLoggedIn(): boolean {
    // Проверяем, есть ли информация о текущем пользователе или токен аутентификации
    // Верните true, если пользователь аутентифицирован, иначе false
    // Пример проверки на основе наличия информации о пользователе в localStorage:
    return localStorage.getItem('agent') !== null;
  }

  logout() {
    localStorage.removeItem('agent');
    this.currentAgent.set(null);
  }

  currentAgentValue(): Agent | null {
    return this.currentAgent();
  }
  
  getDecodedToken(token: string) {
    return JSON.parse(atob(token.split('.')[1]))
  }

  getToken(): string | null {
    const agent = this.currentAgentValue();
    return agent ? agent.token : null; // Assuming the Agent model has a token field
  }

}
