import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { CreateReportDto, CreateReportEntryDto, ReportDto } from '../_dto/report.dto';
import { Report } from '../_models/report';
import { Entry } from '../_models/report';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  baseUrl = 'https://localhost:5001/api/reports';

  constructor(private http: HttpClient) { }

  //Отправляет POST запрос для создания нового отчета.
  createReport(createReportDto: CreateReportDto): Observable<ReportDto> {
    return this.http.post<ReportDto>(this.baseUrl, createReportDto).pipe(
      catchError((error: any) => {
        console.error('Error creating report:', error);
        return throwError(() => new Error('Error creating report'));
      })
    );
  }

  //Получает отчет по его идентификатору.
  getReportById(id: number): Observable<Report> {
    return this.http.get<Report>(`${this.baseUrl}/${id}`);
  }

  //Создает запись в отчете по указанному reportId.
  createReportEntry(reportId: number, createReportEntryDto: CreateReportEntryDto): Observable<Entry> {
    console.log(`${this.baseUrl}/${reportId}/entries`);
    return this.http.post<Entry>(`${this.baseUrl}/${reportId}/entries`, createReportEntryDto).pipe(
      catchError((error: any) => {
        console.error('Error creating report entry:', error);
        return throwError(() => new Error('Error creating report entry'));
      })
    );
  }

  //Получает отчет по его идентификатору.
  getReport(id: number): Observable<Report> {
    return this.http.get<Report>(`${this.baseUrl}/${id}`).pipe(
      catchError((error: any) => {
        console.error('Error fetching report:', error);
        return throwError(() => new Error('Error fetching report'));
      })
    );
  }

  //Получает запись отчета по ее идентификатору.
  getReportEntry(entryId: number): Observable<Entry> {
    return this.http.get<Entry>(`${this.baseUrl}/entries/${entryId}`).pipe(
      catchError((error: any) => {
        console.error('Error fetching report entry:', error);
        return throwError(() => new Error('Error fetching report entry'));
      })
    );
  }

  // Подтверждает отчет по его идентификатору.
  confirmReport(reportId: number): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/${reportId}/confirm`, {});
  }

  //Подтверждает запись отчета по ее идентификаторам.
  confirmReportEntry(reportId: number, entryId: number): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/${reportId}/entries/${entryId}/confirm`, {});
  }

  //Получает список всех отчетов.
  getReports(): Observable<Report[]> {
    return this.http.get<Report[]>(this.baseUrl).pipe(
      catchError((error: any) => {
        console.error('Error fetching reports:', error);
        return throwError(() => new Error('Error fetching reports'));
      })
    );
  }
}
