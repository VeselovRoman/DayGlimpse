import { Component, OnInit, ViewChild } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { BranchService } from '../_services/branch.service';
import { Branch } from '../_models/branch';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { BranchDialogComponent } from '../branch-dialog/branch-dialog.component';

@Component({
  selector: 'app-branch-list',
  templateUrl: './branch-list.component.html'
})
export class BranchListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'actions'];
  dataSource = new MatTableDataSource<Branch>();
  branches: Branch[] = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private branchService: BranchService, private dialog: MatDialog) { }

  ngOnInit() {
    this.loadBranches();
  }

  loadBranches() {
    this.branchService.getBranches().subscribe(data => {
      this.branches = data;
      this.dataSource.data = this.branches;
      this.dataSource.paginator = this.paginator;
    });
  }

  openDialog(branch?: Branch): void {
    const dialogRef = this.dialog.open(BranchDialogComponent, {
      width: '400px',
      data: branch ? { ...branch } : { id: 0, name: '' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.id) {
          this.branchService.updateBranch(result).subscribe(() => {
            this.loadBranches();
          });
        } else {
          this.branchService.addBranch(result).subscribe(() => {
            this.loadBranches();
          });
        }
      }
    });
  }

  deleteBranch(id: number) {
    this.branchService.deleteBranch(id).subscribe(() => {
      this.loadBranches();
    });
  }
}