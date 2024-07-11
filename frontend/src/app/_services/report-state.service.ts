import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Report } from '../_models/report';
import { ReportService } from './report.service';

@Injectable({
  providedIn: 'root'
})
export class ReportStateService {
  private reportsSubject: BehaviorSubject<Report[]> = new BehaviorSubject<Report[]>([]);
  reports$: Observable<Report[]> = this.reportsSubject.asObservable();

  constructor(private reportService: ReportService) {}

  loadReports(): void {
    this.reportService.getReports().subscribe(reports => {
      this.reportsSubject.next(reports);
    });
  }

  getReports(): Observable<Report[]> {
    return this.reports$;
  }
}
