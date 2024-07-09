import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AgentService } from '../_services/agent.service';
import { Agent } from '../_models/agent';
import { Branch } from '../_models/branch';

@Component({
  selector: 'app-agent-detail',
  templateUrl: './agent-detail.component.html',
  styleUrls: ['./agent-detail.component.css']
})
export class AgentDetailComponent implements OnInit {
  agent: Agent;
  branches: Branch[] = []; // Массив для хранения списка филиалов

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private agentService: AgentService
  ) {
    this.agent = {
      id: 0,
      agentName: '',
      token: '',
      branchId: 0,
      city: '',
      registrationDate: new Date()
    };
  }

  ngOnInit(): void {
    this.loadAgent();
    this.loadBranches(); // Загрузка списка филиалов при инициализации компонента
  }


  loadAgent() {
    const agentId = this.route.snapshot.paramMap.get('id');
    if (agentId) {
      this.agentService.getAgentById(parseInt(agentId, 10)).subscribe({
        next: (agent: Agent) => {
          this.agent = agent;
        },
        error: (error: any) => {
          console.error('Error loading agent:', error);
        }
      });
    }
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

  saveAgent() {
    this.agentService.updateAgent(this.agent).subscribe({
      next: () => {
        console.log('Agent updated successfully');
        this.router.navigate(['/agents']);
      },
      error: (error: any) => {
        console.error('Error updating agent:', error);
      }
    });
  }


  cancel() {
    this.router.navigate(['/agents']);
  }

}
