import { Component, OnInit, ViewChild } from '@angular/core';
import { ReportService } from '../_services/report.service';
import { Report } from '../_models/report';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { NewReportComponent } from '../new-report/new-report.component';

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
    public dialog: MatDialog
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

        // Переопределение метода фильтрации, чтобы исключить startTime и endTime
        this.dataSource.filterPredicate = (data: Report, filter: string) => {
          const transformedFilter = filter.trim().toLowerCase();
          const dataStr = (data.id + ' ' + data.agentName + ' ' + data.respondentName + ' ' + data.isConfirmed).toLowerCase();
          return dataStr.includes(transformedFilter);
        };

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

  openNewReportDialog(): void {
    const dialogRef = this.dialog.open(NewReportComponent, {
      width: '600px',
      data: { /* данные, если необходимы */ }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.router.navigate(['/reports', result, 'edit']); // Переход к редактированию созданного отчёта
      }
    });
  }

  closeViewReport() {
    this.selectedReport = null;
    this.loadReports(); // Перезагрузка списка отчетов
  }
}
