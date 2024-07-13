import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AgentService } from '../_services/agent.service';
import { Agent } from '../_models/agent';
import { Branch } from '../_models/branch';
import { updateAgent } from '../_models/updateAgent';

@Component({
  selector: 'app-agent-detail',
  templateUrl: './agent-detail.component.html',
  styleUrls: ['./agent-detail.component.css']
})
export class AgentDetailComponent implements OnInit {
  agent: Agent;
  updatedAgent: updateAgent;
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
      branchName: '',
      city: '',
      registrationDate: ''
    };
    this.updatedAgent = {
      id: 0,
      agentName: '',
      branchId: 0,
      city: '',
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
          console.log('Загруженный агент:', agent);
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
    this.updatedAgent.id = this.agent.id;
    this.updatedAgent.agentName = this.agent.agentName;
    this.updatedAgent.branchId = this.agent.branchId;
    this.updatedAgent.city = this.agent.city;

    this.agentService.updateAgent(this.updatedAgent).subscribe({
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
