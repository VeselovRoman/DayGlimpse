import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AgentService } from '../_services/agent.service';
import { Agent } from '../_models/agent';
import { Branch } from '../_models/branch';

@Component({
  selector: 'app-agent-list',
  templateUrl: './agent-list.component.html',
  styleUrls: ['./agent-list.component.css']
})
export class AgentListComponent implements OnInit {
  agents: Agent[] = [];
  branches: Branch[] = [];

  constructor(private agentService: AgentService, private router: Router) { }

  ngOnInit(): void {
    this.loadAgents();
    this.loadBranches();
  }

  loadAgents() {
    this.agentService.getAllAgents().subscribe({
      next: (agents: Agent[]) => {
        this.agents = agents;
        console.log('Загруженные агенты:', this.agents); // console.log внутрь функции next
      },
      error: (error: any) => {
        console.error('Error loading agents:', error);
      }
    });
  }

  loadBranches() {
    this.agentService.getAllBranches().subscribe({
      next: (branches: Branch[]) => {
        this.branches = branches;
        console.log('Загруженные филиалы:', this.branches); // Лог филиалы в консоль
      },
      error: (error: any) => {
        console.error('Error loading branches:', error);
      }
    });
  }

  getBranchName(branchId: number | null): string {
    const branch = this.branches.find(b => b.id === branchId);
    return branch ? branch.name : 'Unknown';
  }

  editAgent(agentId: number) {
    this.router.navigate(['/agents', agentId]);
    console.log(agentId)
  }

}
