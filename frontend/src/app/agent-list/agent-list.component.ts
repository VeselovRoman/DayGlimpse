import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AgentService } from '../_services/agent.service';
import { Agent } from '../_models/agent';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { AgentDialogComponent } from '../agent-dialog/agent-dialog.component';

@Component({
  selector: 'app-agent-list',
  templateUrl: './agent-list.component.html',
  styleUrls: ['./agent-list.component.css']
})
export class AgentListComponent implements OnInit {
  agents: Agent[] = [];
  displayedColumns: string[] = ['id', 'agentName', 'city', 'branchName', 'actions'];
  dataSource = new MatTableDataSource<Agent>(this.agents);

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private agentService: AgentService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.loadAgents();
    this.dataSource.data = this.agents;
  }

  loadAgents() {
    this.agentService.getAllAgents().subscribe({
      next: (agents: Agent[]) => {
        this.agents = agents;
        this.dataSource = new MatTableDataSource(this.agents);
        this.dataSource.paginator = this.paginator;
        console.log('Загруженные агенты:', this.agents); // console.log внутрь функции next
      },
      error: (error: any) => {
        console.error('Error loading agents:', error);
      }
    });
  }

  editAgent(agent: Agent) {
    const dialogRef = this.dialog.open(AgentDialogComponent, {
      width: '400px',
      data: { agent }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadAgents();
      }
    });
  }
}
