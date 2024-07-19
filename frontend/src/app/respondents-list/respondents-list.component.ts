import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RespondentDialogComponent } from '../respondent-dialog/respondent-dialog.component';
import { RespondentService } from '../_services/respondent.service';
import { BranchService } from '../_services/branch.service';
import { Respondent } from '../_models/respondent';
import { Branch } from '../_models/branch';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-respondent-list',
  templateUrl: './respondents-list.component.html',
  styleUrls: ['./respondents-list.component.css']
})
export class RespondentListComponent implements OnInit {
  respondents: Respondent[] = [];
  branches: Branch[] = [];
  displayedColumns: string[] = ['id', 'name', 'registrationDate', 'city', 'branchName', 'actions'];
  dataSource = new MatTableDataSource<Respondent>(this.respondents);

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private respondentService: RespondentService,
    private branchService: BranchService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.loadRespondents();
    this.loadBranches();
  }

  loadRespondents() {
    this.respondentService.getRespondents().subscribe(data => {
      this.respondents = data.sort((a, b) => a.id - b.id);

      this.respondents.forEach(respondent => {
        const branch = this.branches.find(b => b.id === respondent.branchId);
        if (branch) {
          respondent.branchName = branch.name;
        }
      });

      this.dataSource = new MatTableDataSource(this.respondents);
      this.dataSource.paginator = this.paginator;

    });
  }

  loadBranches() {
    this.branchService.getBranches().subscribe(data => {
      this.branches = data;
    });
  }

  openDialog(respondent?: Respondent): void {
    const dialogRef = this.dialog.open(RespondentDialogComponent, {
      width: '400px',
      data: {
        respondent: respondent ? { ...respondent } : { id: 0, name: '', registrationDate: new Date(), city: '', branchId: 0 },
        branches: this.branches
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.id) {
          this.respondentService.updateRespondent(result.id, result).subscribe(() => {
            this.loadRespondents();
          });
        } else {
          this.respondentService.createRespondent(result).subscribe(() => {
            this.loadRespondents();
          });
        }
      }
    });
  }

  deleteRespondent(id: number) {
    this.respondentService.deleteRespondent(id).subscribe(() => {
      this.loadRespondents();
    });
  }
}
