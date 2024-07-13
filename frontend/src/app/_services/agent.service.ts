import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Agent } from '../_models/agent';
import { Branch } from '../_models/branch';
import { updateAgent } from '../_models/updateAgent';

@Injectable({
  providedIn: 'root'
})
export class AgentService {

  private baseUrl = 'https://localhost:5001/api/'; // Замените на ваш базовый URL API
  //token = '';
  //agent = localStorage.getItem('agent');

  constructor(private http: HttpClient) { }

  getAllAgents(): Observable<Agent[]> {
    return this.http.get<Agent[]>(this.baseUrl + 'agents');
  }

  getAgentById(id: number): Observable<Agent> {
    // Получение токена из localStorage

    /*if (this.agent) {
      // Преобразуем строку обратно в объект JavaScript
      const agentData = JSON.parse(this.agent);

      // Извлекаем значение токена
      this.token = agentData.token;

      console.log('Токен из объекта:', this.token);
    } else {
      console.log('Данные агента не найдены в localStorage');
    }

    // Установка заголовков для передачи токена
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });*/

    // Отправка GET-запроса на сервер с заголовками
    return this.http.get<Agent>(`${this.baseUrl}agents/${id}`);
  }

  updateAgent(agent: updateAgent): Observable<void> {
    // Получение токена из localStorage
    /*if (this.agent) {
      // Преобразуем строку обратно в объект JavaScript
      const agentData = JSON.parse(this.agent);

      // Извлекаем значение токена
      this.token = agentData.token;

      console.log('Токен из объекта:', this.token);
    } else {
      console.log('Данные агента не найдены в localStorage');
    }

    // Установка заголовков для передачи токена
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });*/

    // Отправка GET-запроса на сервер с заголовками
    return this.http.put<void>(`${this.baseUrl}agents/${agent.id}`, agent);
  }

  getAllBranches(): Observable<Branch[]> {
    return this.http.get<Branch[]>(this.baseUrl + 'branches');
  }

}
