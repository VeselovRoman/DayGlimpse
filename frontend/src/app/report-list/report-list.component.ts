import { Component, OnInit } from '@angular/core';
import { ReportService } from '../_services/report.service';
import { Report } from '../_models/report';
import { Router } from '@angular/router';
import { ReportStateService } from '../_services/report-state.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-report-list',
  templateUrl: './report-list.component.html',
  styleUrls: ['./report-list.component.css']
})
export class ReportListComponent implements OnInit {
  reports: Report[] = [];
  selectedReport: Report | null = null;
  isLoading: boolean = true;
  displayedColumns: string[] = ['id', 'reportEntries', 'reportDate', 'agentName', 'respondentName', 'status', 'actions'];
  dataSource = new MatTableDataSource<Report>(this.reports);

  constructor(private reportService: ReportService,
    private router: Router,
    private reportStateService: ReportStateService
  ) { }

  ngOnInit(): void {
    this.isLoading = true;
    
    this.reportStateService.getReports().subscribe(reports => {
      this.reports = reports;
      
    });
    this.reportStateService.loadReports(); // Загружаем отчеты при инициализации компонента
    this.isLoading = false;
    this.dataSource.data = this.reports;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
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
    console.log('Редактирование отчета:', report, 'Навигация: ', '/reports', report.id, 'edit');  // Добавлено для отладки
    //this.selectedReport = report;
    this.router.navigate(['/reports', report.id, 'edit']);
  }

  closeViewReport() {
    //this.selectedReport = null;
    this.loadReports(); // Перезагрузка списка отчетов
  }


}
