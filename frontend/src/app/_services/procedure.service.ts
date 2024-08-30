// src/app/_services/procedure.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Procedure } from '../_models/procedures';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProcedureService {
  baseUrl = environment.apiUrl + 'Procedures/';

  constructor(private http: HttpClient) { }

  // Получает список всех процедур
  getProcedures(): Observable<Procedure[]> {
    return this.http.get<Procedure[]>(this.baseUrl);
  }

  // Получает одну процедуру по ID
  getProcedure(id: number): Observable<Procedure> {
    return this.http.get<Procedure>(`${this.baseUrl}${id}`);
  }

  // Создает новую процедуру
  createProcedure(procedure: Procedure): Observable<Procedure> {
    return this.http.post<Procedure>(this.baseUrl, procedure);
  }

  // Обновляет процедуру по ID
  updateProcedure(id: number, procedure: Procedure): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}${id}`, procedure);
  }
}
