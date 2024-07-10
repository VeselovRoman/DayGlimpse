import { Component, OnInit } from '@angular/core';
import { ReportService } from '../_services/report.service';
import { Report } from '../_models/report';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-report-list',
  templateUrl: './report-list.component.html',
  styleUrls: ['./report-list.component.css']
})
export class ReportListComponent implements OnInit {
  reports: Report[] = [];
  selectedReport: Report | null = null;

  constructor(private reportService: ReportService) {}

  ngOnInit(): void {
    this.loadReports();
  }

  loadReports() {
    this.reportService.getReports().subscribe({
      next: (reports) => {
        this.reports = reports;
        console.log('Загруженные отчеты:', this.reports);
      },
      error: (error) => console.error('Error fetching reports:', error)
    });
  }

  viewEntries(report: Report) {
    console.log('Просмотр записей для отчета:', report); // Добавить для отладки
    this.selectedReport = report;
  }

  editReport(report: Report) {
    console.log('Редактирование отчета:', report);  // Добавлено для отладки
    this.selectedReport = report;
  }
  
  closeViewReport() {
    this.selectedReport = null;
    this.loadReports(); // Перезагрузка списка отчетов
  }

 
}
