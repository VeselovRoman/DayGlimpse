import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ProcedureService } from '../_services/procedure.service';
import { Procedure } from '../_models/procedures'; // Создайте интерфейс Procedure
import { ProcedureDialogComponent } from '../procedure-dialog/procedure-dialog.component';

@Component({
  selector: 'app-procedure-list',
  templateUrl: './procedure-list.component.html',
  styleUrls: ['./procedure-list.component.css']
})
export class ProcedureListComponent implements OnInit {
  procedures: Procedure[] = [];
  displayedColumns: string[] = ['id', 'name', 'actions'];
  dataSource = new MatTableDataSource<Procedure>();

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private procedureService: ProcedureService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.procedureService.getProcedures().subscribe({
      next: (procedures) => {
        this.procedures = procedures.sort((a, b) => a.id - b.id);
        this.dataSource = new MatTableDataSource(this.procedures);
        this.dataSource.paginator = this.paginator;
      },
      error: (error) => {
        console.error('Error loading data', error);
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDialog(procedure?: Procedure): void {
    const dialogRef = this.dialog.open(ProcedureDialogComponent, {
      width: '500px',
      data: procedure ? { ...procedure } : { id: 0, name: '', standardTime: 0 }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.id) {
          this.procedureService.updateProcedure(result.id, result).subscribe(() => {
            this.loadData();
          });
        } else {
          this.procedureService.createProcedure(result).subscribe(() => {
            this.loadData();
          });
        }
      }
    });
  }
}
