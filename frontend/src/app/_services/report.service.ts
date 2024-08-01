import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of, tap, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { CreateReportDto, CreateReportEntryDto, ReportDto, UpdateReportEntryDto } from '../_dto/report.dto';
import { Report } from '../_models/report';
import { Entry } from '../_models/report';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  baseUrl = environment.apiUrl + 'reports/';

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
    return this.http.get<Report>(`${this.baseUrl}${id}`);
  }

  //Создает запись в отчете по указанному reportId.
  createReportEntry(reportId: number, createReportEntryDto: CreateReportEntryDto): Observable<CreateReportEntryDto> {
    console.log(`${this.baseUrl}${reportId}/entries`);
    console.log('reportId: ', reportId, 'createReportEntryDto', createReportEntryDto)
    return this.http.post<CreateReportEntryDto>(`${this.baseUrl}${reportId}/entries`, createReportEntryDto).pipe(
      catchError((error: any) => {
        console.error('Error creating report entry:', error);
        return throwError(() => new Error('Error creating report entry'));
      })
    );
  }

  //Получает отчет по его идентификатору.
  getReport(id: number): Observable<Report> {
    return this.http.get<Report>(`${this.baseUrl}${id}`).pipe(
      catchError((error: any) => {
        return throwError(() => new Error('Error fetching report'));
      })
    );
  }

  //Получает запись отчета по ее идентификатору.
  getReportEntry(entryId: number): Observable<Entry> {
    return this.http.get<Entry>(`${this.baseUrl}entries/${entryId}`).pipe(
      catchError((error: any) => {
        console.error('Error fetching report entry:', error);
        return throwError(() => new Error('Error fetching report entry'));
      })
    );
  }

  // Подтверждает отчет по его идентификатору.
  /*confirmReport(reportId: number): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}${reportId}/confirm`, {});
  }*/

    confirmReport(reportId: number): Observable<any> {
      const url = `${this.baseUrl}${reportId}/confirm`;
      console.log(`Sending request to: ${url}`);
      return this.http.put<any>(url, {}).pipe(
        tap(response => {
          console.log(`Response for report ${reportId}:`, response);
        }),
        catchError(error => {
          console.error(`Error confirming report ${reportId}:`, error);
          return of(null); // Возвращаем null в случае ошибки
        })
      );
    }
    
  //Подтверждает запись отчета по ее идентификаторам.
  /*confirmReportEntry(reportId: number, entryId: number): Observable<any> {
    console.log(`${this.baseUrl}${reportId}/entries/${entryId}/confirm`);
    return this.http.put<any>(`${this.baseUrl}${reportId}/entries/${entryId}/confirm`, {});
  }*/

    confirmReportEntry(reportId: number, entryId: number): Observable<any> {
      const url = `${this.baseUrl}${reportId}/entries/${entryId}/confirm`;
      console.log(`Sending request to: ${url}`);
      return this.http.put<any>(url, {}).pipe(
        tap(response => {
          console.log(`Response for entry ${entryId}:`, response);
        }),
        catchError(error => {
          console.error(`Error confirming entry ${entryId}:`, error);
          return of(null); // Возвращаем null в случае ошибки
        })
      );
    }
  
  //Получает список всех отчетов.
  getReports(): Observable<Report[]> {
    return this.http.get<Report[]>(`${this.baseUrl}`).pipe(
      catchError((error: any) => {
        console.error('Error fetching reports:', error);
        return throwError(() => new Error('Error fetching reports'));
      })
    );
  }

  // Обновляет запись отчета
  updateReportEntry(reportId: number, entryId: number, updateData: Partial<UpdateReportEntryDto>): Observable<UpdateReportEntryDto> {
    const url = `${this.baseUrl}${reportId}/entries/${entryId}`;
    return this.http.put<UpdateReportEntryDto>(url, updateData).pipe(
      catchError((error: any) => {
        console.error('Error updating report entry:', error);
        return throwError(() => new Error('Error updating report entry'));
      })
    );
  }

  // Метод для удаления записи отчета
  deleteReportEntry(reportId: number, entryId: number): Observable<void> {
    const url = `${this.baseUrl}${reportId}/entries/${entryId}`;
    return this.http.delete<void>(url);
  }
}
