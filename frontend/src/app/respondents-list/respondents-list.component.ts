import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RespondentDialogComponent } from '../respondent-dialog/respondent-dialog.component';
import { RespondentService } from '../_services/respondent.service';
import { BranchService } from '../_services/branch.service';
import { Respondent } from '../_models/respondent';
import { Branch } from '../_models/branch';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-respondent-list',
  templateUrl: './respondents-list.component.html',
  styleUrls: ['./respondents-list.component.css']
})
export class RespondentListComponent implements OnInit {
  respondents: Respondent[] = [];
  branches: Branch[] = [];
  displayedColumns: string[] = ['id', 'name', 'registrationDate', 'city', 'branchName', 'actions'];
  dataSource = new MatTableDataSource<Respondent>();

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private respondentService: RespondentService,
    private branchService: BranchService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    forkJoin({
      respondents: this.respondentService.getRespondents(),
      branches: this.branchService.getBranches()
    }).subscribe({
      next: ({ respondents, branches }) => {
        this.branches = branches;
        this.respondents = respondents.sort((a, b) => a.id - b.id);
        this.respondents.forEach(respondent => {
          const branch = this.branches.find(b => b.id === respondent.branchId);
          if (branch) {
            respondent.branchName = branch.name;
          }
        });

        this.dataSource = new MatTableDataSource(this.respondents);
        if (this.paginator) {
          this.dataSource.paginator = this.paginator;
        }
      },
      error: error => {
        console.error('Error loading data', error);
      }
    });
  }

  openDialog(respondent?: Respondent): void {
    console.log('registrationDate', this.getCurrentDateString());
    const dialogRef = this.dialog.open(RespondentDialogComponent, {
      width: '500px',
      data: {
        respondent: respondent ? { ...respondent } : { id: 0, name: '', registrationDate: this.getCurrentDateString(), city: '', branchId: 0 },
        branches: this.branches
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(result);
        if (result.id) {
          this.respondentService.updateRespondent(result.id, result).subscribe(() => {
            this.loadData();
          });
        } else {
          this.respondentService.createRespondent(result).subscribe(() => {
            console.log('Создаю нового респондента');
            this.loadData();
          });
        }
      }
    });
  }

  deleteRespondent(id: number) {
    this.respondentService.deleteRespondent(id).subscribe(() => {
      this.loadData();
    });
  }

  // Метод для получения текущей даты в формате строки (без учета часового пояса)
  private getCurrentDateString(): string {
    const now = new Date();
    const formattedDate = now.toLocaleString('sv-SE', { hour12: false });
    return formattedDate.replace(' ', 'T');
  }

}
