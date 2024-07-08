import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Respondent } from '../_models/respondent';

@Injectable({
  providedIn: 'root'
})
export class RespondentService {
  private apiUrl = environment.apiUrl + 'respondents';

  constructor(private http: HttpClient) { }

  //Получает список всех респондентов
  getRespondents(): Observable<Respondent[]> {
    return this.http.get<Respondent[]>(this.apiUrl);
  }

  //Получает респондента по его идентификатор
  getRespondent(id: number): Observable<Respondent> {
    return this.http.get<Respondent>(`${this.apiUrl}${id}`);
  }

  //Создает нового респондента.
  createRespondent(respondent: Respondent): Observable<Respondent> {
    return this.http.post<Respondent>(this.apiUrl, respondent);
  }

  //Обновляет данные существующего респондента.
  updateRespondent(id: number, respondent: Respondent): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}${id}`, respondent);
  }

  //Удаляет респондента.
  deleteRespondent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}`);
  }
}
