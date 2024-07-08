// src/app/_services/procedure.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Procedure } from '../_models/procedures';

@Injectable({
  providedIn: 'root'
})
export class ProcedureService {
  baseUrl = 'https://localhost:5001/api/';

  constructor(private http: HttpClient) { }

  //Получает список всех процедур.
  getProcedures(): Observable<Procedure[]> {
    
    return this.http.get<Procedure[]>(this.baseUrl + 'procedures');
  }
}
