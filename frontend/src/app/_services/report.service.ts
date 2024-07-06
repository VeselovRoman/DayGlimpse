import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Report, ReportEntry } from '../_models/report';
import { CreateReportDto, CreateReportEntryDto } from '../_dto/report.dto';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  baseUrl = 'https://localhost:5001/api/reports/';

  constructor(private http: HttpClient) { }

  createReport(createReportDto: CreateReportDto): Observable<Report> {
    return this.http.post<Report>(this.baseUrl, createReportDto);
  }

  createReportEntry(reportId: number, createReportEntryDto: CreateReportEntryDto): Observable<ReportEntry> {
    return this.http.post<ReportEntry>(`${this.baseUrl}${reportId}/entries`, createReportEntryDto);
  }

  getReport(id: number): Observable<Report> {
    return this.http.get<Report>(`${this.baseUrl}${id}`);
  }

  getReportEntry(entryId: number): Observable<ReportEntry> {
    return this.http.get<ReportEntry>(`${this.baseUrl}entries/${entryId}`);
  }
}
