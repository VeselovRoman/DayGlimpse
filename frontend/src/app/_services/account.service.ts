import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Agent } from '../_models/agent';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl = environment.apiUrl;

  // Используем BehaviorSubject для хранения текущего агента
  private currentAgentSource = new BehaviorSubject<Agent | null>(null);
  currentAgent$ = this.currentAgentSource.asObservable();

  constructor(private http: HttpClient) {
    // Проверяем, есть ли агент в localStorage и устанавливаем его в текущего агента
    const agent = localStorage.getItem('agent');
    if (agent) {
      this.currentAgentSource.next(JSON.parse(agent));
    }
  }

  // Метод регистрации, отправляет запрос и обновляет состояние при успешной регистрации
  register(model: any): Observable<Agent> {
    return this.http.post<Agent>(`${this.baseUrl}agents/register`, model).pipe(
      map(agent => {
        if (agent) {
          this.setCurrentAgent(agent);
        }
        return agent;
      })
    );
  }

  // Метод установки текущего агента в localStorage и обновление текущего агента в BehaviorSubject
  setCurrentAgent(agent: Agent) {
    localStorage.setItem('agent', JSON.stringify(agent));
    this.currentAgentSource.next(agent);
  }

  // Метод логина, отправляет запрос и обновляет состояние при успешном входе
  login(model: any): Observable<Agent> {
    return this.http.post<Agent>(`${this.baseUrl}agents/login`, model).pipe(
      map(agent => {
        if (agent) {
          console.log(agent);
          this.setCurrentAgent(agent);
        }
        return agent;
      })
    );
  }

  // Метод проверки, залогинен ли пользователь
  isLoggedIn(): boolean {
    return localStorage.getItem('agent') !== null;
  }

  // Метод логаута, очищает localStorage и сбрасывает состояние текущего агента
  logout() {
    localStorage.removeItem('agent');
    this.currentAgentSource.next(null);
  }

  // Метод получения текущего агента как объект
  currentAgentValue(): Agent | null {
    return this.currentAgentSource.value;
  }

  // Метод декодирования JWT токена
  getDecodedToken(token: string) {
    return JSON.parse(atob(token.split('.')[1]));
  }

  // Метод получения токена текущего агента
  getToken(): string | null {
    const agent = this.currentAgentValue();
    const token = agent?.token ?? null;

    console.log('Agent token:', token);

    return token;
  }
}
