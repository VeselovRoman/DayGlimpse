import { Component, Inject, OnInit } from '@angular/core';
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
  agent: Agent;
  branches: Branch[] = [];
  selectedBranchName: string = '';

  constructor(
    public dialogRef: MatDialogRef<AgentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private agentService: AgentService,
    private toastr: ToastrService
  ) {
    this.agent = data.agent;
    if (!this.agent.city) {
      this.agent.city = ''; // Инициализация пустым значением вместо null
    }
  }

  ngOnInit(): void {
    this.loadBranches();
  }

  loadBranches() {
    this.agentService.getAllBranches().subscribe({
      next: (branches) => {
        this.branches = branches;
        this.selectedBranchName = this.branches.find(branch => branch.id === this.agent.branchId)?.name || '';
        console.log(this.branches); // Проверяем загрузку филиалов в консоли
      },
      error: (error) => {
        console.error('Не удалось получить список филиалов', error);
      }
    });
  }

  saveAgent() {
    const updatedAgent: updateAgent = {
      id: this.agent.id,
      branchId: this.agent.branchId,
      city: this.agent.city
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
    this.agent.branchId = branchId;
    this.selectedBranchName = this.branches.find(branch => branch.id === branchId)?.name || '';
  }
}
