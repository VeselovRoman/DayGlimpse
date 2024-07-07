// src/app/_services/procedure.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProcedureDto } from '../_dto/procedure.dto';

@Injectable({
  providedIn: 'root'
})
export class ProcedureService {
  baseUrl = 'https://localhost:5001/api/';

  constructor(private http: HttpClient) { }

  getProcedures(): Observable<ProcedureDto[]> {
    
    return this.http.get<ProcedureDto[]>(this.baseUrl + 'procedures');
  }
}
