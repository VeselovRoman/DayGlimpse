import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Report } from '../_models/report';
import { CreateReportDto, CreateReportEntryDto } from '../_dto/report.dto';
import { Entry } from '../_models/entry';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  baseUrl = 'https://localhost:5001/api/reports';

  constructor(private http: HttpClient) { }

  getReports(): Observable<Report[]> {
    return this.http.get<Report[]>(this.baseUrl).pipe(
      catchError((error: any) => {
        console.error('Error fetching reports:', error);
        return throwError(() => new Error('Error fetching reports'));
      })
    );
  }

  createReport(createReportDto: CreateReportDto): Observable<Report> {
    return this.http.post<Report>(this.baseUrl, createReportDto).pipe(
      catchError((error: any) => {
        console.error('Error creating report:', error);
        return throwError(() => new Error('Error creating report'));
      })
    );
  }

  createReportEntry(reportId: number, createReportEntryDto: CreateReportEntryDto): Observable<Entry> {
    return this.http.post<Entry>(`${this.baseUrl}${reportId}/entries`, createReportEntryDto).pipe(
      catchError((error: any) => {
        console.error('Error creating report entry:', error);
        return throwError(() => new Error('Error creating report entry'));
      })
    );
  }

  getReport(id: number): Observable<Report> {
    return this.http.get<Report>(`${this.baseUrl}${id}`).pipe(
      catchError((error: any) => {
        console.error('Error fetching report:', error);
        return throwError(() => new Error('Error fetching report'));
      })
    );
  }

  getReportEntry(entryId: number): Observable<Entry> {
    return this.http.get<Entry>(`${this.baseUrl}entries/${entryId}`).pipe(
      catchError((error: any) => {
        console.error('Error fetching report entry:', error);
        return throwError(() => new Error('Error fetching report entry'));
      })
    );
  }
}
