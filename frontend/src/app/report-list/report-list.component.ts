import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Report } from '../_models/report';
import { ReportService } from '../_services/report.service';

@Component({
  selector: 'app-report-list',
  templateUrl: './report-list.component.html',
  styleUrls: ['./report-list.component.css']
})
export class ReportListComponent implements OnInit {
  reports: Report[] = [];
  selectedReport: Report | null = null;

  constructor(private reportService: ReportService, private router: Router) {}

  ngOnInit(): void {
    this.loadReports();
  }

  loadReports() {
    this.reportService.getReports().subscribe({
      next: (reports) => {
        this.reports = reports,
        console.log('Загруженные отчеты:', this.reports); // console.log внутрь функции next

      },
      error: (error) => console.error('Error fetching reports:', error)
    });
  }

  viewEntries(report: Report) {
    console.log('Просмотр записей для отчета:', report); // Добавить для отладки
    this.selectedReport = report;
  }

  editReport(report: Report) {
    this.selectedReport = report;
    console.log('Navigate to report: ' + this.selectedReport.id);
    console.log(report);
    //this.router.navigate(['/view-report', report.id]);
  }

  closeViewReport() {
    this.selectedReport = null;
  }

 
}
