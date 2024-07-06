import { Component, OnInit } from '@angular/core';
import { ReportService } from '../_services/report.service';
import { Report } from '../_models/report';

@Component({
  selector: 'app-report-list',
  templateUrl: './report-list.component.html',
  styleUrls: ['./report-list.component.css']
})
export class ReportListComponent implements OnInit {
  [x: string]: any;
  reports: Report[] = [];
  selectedReport: Report | null = null;


  constructor(private reportService: ReportService) { }

  ngOnInit(): void {
    this.loadReports()
  }

  loadReports() {
    this.reportService.getReports().subscribe({
      next: (reports) => {
        this.reports = reports,
        console.log('Загруженные агенты:', this.reports); // console.log внутрь функции next

      },
      error: (error) => console.error('Error fetching reports:', error)
    });
  }

  viewEntries(report: Report) {
    console.log('Viewing entries for report:', report); // Добавьте эту строку для отладки
    this.selectedReport = report;
  }

}
