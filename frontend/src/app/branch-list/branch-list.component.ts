import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { BranchService } from '../_services/branch.service';

@Component({
  selector: 'app-branch-list',
  templateUrl: './branch-list.component.html'
})
export class BranchListComponent implements OnInit {
  branches: any[] = [];
  selectedBranch: any;
  modalRef?: BsModalRef;

  constructor(private branchService: BranchService, private modalService: BsModalService) {}

  ngOnInit() {
    this.loadBranches();
  }

  loadBranches() {
    this.branchService.getBranches().subscribe(data => {
      this.branches = data.sort((a, b) => a.id - b.id); // Сортируем филиалы по id
    });
  }

  openModal(template: TemplateRef<any>, branch?: any) {
    this.selectedBranch = branch ? { ...branch } : {Name: '' };
    this.modalRef = this.modalService.show(template);
  }

  saveBranch() {
    if (this.selectedBranch.id) {
      this.branchService.updateBranch(this.selectedBranch).subscribe(() => {
        this.loadBranches();
      });
    } else {
      this.branchService.addBranch(this.selectedBranch).subscribe(() => {
        this.loadBranches();
      });
    }
    this.modalRef?.hide();
  }

  deleteBranch(id: number) {
    this.branchService.deleteBranch(id).subscribe(() => {
      this.loadBranches();
    });
  }
}