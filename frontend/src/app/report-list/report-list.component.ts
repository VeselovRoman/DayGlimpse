import { Component, OnInit, ViewChild } from '@angular/core';
import { ReportService } from '../_services/report.service';
import { Report } from '../_models/report';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

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
  dataSource = new MatTableDataSource<Report>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  
  constructor(
    private reportService: ReportService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.loadReports();
  }

  loadReports() {
    this.isLoading = true;
    this.reportService.getReports().subscribe({
      next: (reports: Report[]) => {
        this.reports = reports;
        
        // Создаем новый MatTableDataSource и устанавливаем пагинатор
      this.dataSource = new MatTableDataSource(this.reports);
      if (this.paginator) {
        this.dataSource.paginator = this.paginator;
      }
        console.log('this.dataSource.data: ', this.dataSource);
        console.log('Paginator:', this.paginator, this.dataSource.paginator);
        this.isLoading = false;
        console.log('Загруженные отчеты:', this.reports);
      },
      error: (error: any) => {
        console.error('Error fetching reports:', error);
        this.isLoading = false;
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  viewEntries(report: Report) {
    console.log('Просмотр записей для отчета:', report);
    this.selectedReport = report;
  }

  editReport(report: Report) {
    console.log('Редактирование отчета:', report);
    this.router.navigate(['/reports', report.id, 'edit']);
  }

  closeViewReport() {
    this.selectedReport = null;
    this.loadReports(); // Перезагрузка списка отчетов
  }
}
