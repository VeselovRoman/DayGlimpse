import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AgentService } from '../_services/agent.service';
import { BranchService } from '../_services/branch.service';
import { Agent } from '../_models/agent';
import { Branch } from '../_models/branch';
import { ToastrService } from 'ngx-toastr';
import { updateAgent } from '../_models/updateAgent';

@Component({
  selector: 'app-agent-dialog',
  templateUrl: './agent-dialog.component.html',
  styleUrls: ['./agent-dialog.component.css']
})
export class AgentDialogComponent implements OnInit {
  agentForm: FormGroup;
  branches: Branch[] = [];
  selectedBranchName: string = '';

  constructor(
    public dialogRef: MatDialogRef<AgentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private agentService: AgentService,
    private toastr: ToastrService
  ) {
    this.agentForm = this.formBuilder.group({
      id: [data.agent.id, Validators.required],
      login: [{value: data.agent.login, disabled: true}, Validators.required],
      firstName: [{value: data.agent.firstName, disabled: true}, Validators.required],
      lastName: [{value: data.agent.lastName, disabled: true}, Validators.required],
      city: [data.agent.city || '', Validators.required],
      branchId: [data.agent.branchId || null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadBranches();
  }

  loadBranches() {
    this.agentService.getAllBranches().subscribe({
      next: (branches) => {
        this.branches = branches;
        this.selectedBranchName = this.branches.find(branch => branch.id === this.agentForm.value.branchId)?.name || '';
      },
      error: (error) => {
        console.error('Не удалось получить список филиалов', error);
      }
    });
  }

  saveAgent() {
    const updatedAgent: updateAgent = {
      id: this.agentForm.value.id,
      branchId: this.agentForm.value.branchId,
      city: this.agentForm.value.city
    };

    this.agentService.updateAgent(updatedAgent).subscribe({
      next: () => {
        this.toastr.success('Данные пользователя успешно обновлены');
        this.dialogRef.close(true);
      },
      error: (error) => {
        console.error('Не удалось обновить данные пользователя', error);
      }
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onBranchChange(branchId: number) {
    this.agentForm.patchValue({ branchId });
    this.selectedBranchName = this.branches.find(branch => branch.id === branchId)?.name || '';
  }
}
