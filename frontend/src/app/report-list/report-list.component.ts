import { Component, OnInit, ViewChild } from '@angular/core';
import { ReportService } from '../_services/report.service';
import { Report } from '../_models/report';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { NewReportComponent } from '../new-report/new-report.component';
import { AuthService } from '../_services/auth.service';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-report-list',
  templateUrl: './report-list.component.html',
  styleUrls: ['./report-list.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed,void', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class ReportListComponent implements OnInit {
  reports: Report[] = [];
  expandedElement: Report | null;
  isLoading: boolean = true;
  displayedColumns: string[] = ['index', 'id', 'reportEntries', 'reportDate', 'agentName', 'respondentName', 'status', 'actions'];
  dataSource = new MatTableDataSource<Report>();
  renderedData: Report[] = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  currentAgentId: number; //текущий agentId для нередактирования чужих отчетов 

  constructor(
    private reportService: ReportService,
    private router: Router,
    public dialog: MatDialog,
    private authService: AuthService
  ) {
    this.currentAgentId = this.authService.getAgentId();
  }

  ngOnInit(): void {
    this.loadReports();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  loadReports() {
    this.isLoading = true;
    this.reportService.getReports().subscribe({
      next: (reports: Report[]) => {
        this.reports = reports;

        this.reports.forEach((report, index) => {
          report.index = index + 1 + (this.paginator.pageIndex * this.paginator.pageSize);
        });
        
        // Создаем новый MatTableDataSource и устанавливаем пагинатор
        this.dataSource = new MatTableDataSource(this.reports);

        if (this.paginator) {
          this.dataSource.paginator = this.paginator;
        }
        this.renderedData = this.dataSource.connect().value;


        // Переопределение метода фильтрации, чтобы исключить startTime и endTime
        this.dataSource.filterPredicate = (data: Report, filter: string) => {
          const transformedFilter = filter.trim().toLowerCase().split(' ');
          const dataStr = (data.id + ' ' + data.agentName + ' ' + data.respondentName + ' ' + data.isConfirmed).toLowerCase();
          
          // Проверка, что каждое слово содержится в строке данных
          return transformedFilter.every(word => dataStr.includes(word));
        };
        console.log('загруженные отчеты: ',  reports);

        this.isLoading = false;
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

  editReport(report: Report) {
    this.router.navigate(['/reports', report.id, 'edit']);
  }

  openNewReportPage(): void {
    this.router.navigate(['/reports/new']);
  }

  getRecordIndex(index: number): number {
    const pageIndex = this.paginator ? this.paginator.pageIndex : 0;
    const pageSize = this.paginator ? this.paginator.pageSize : 10;
    return index + 1 + pageIndex * pageSize;
  }
  

  
}
