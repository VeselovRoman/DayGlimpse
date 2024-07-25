import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Agent } from '../_models/agent';
import { Branch } from '../_models/branch';
import { updateAgent } from '../_models/updateAgent';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AgentService {

  private baseUrl = environment.apiUrl;
  
  constructor(private http: HttpClient) { }

  getAllAgents(): Observable<Agent[]> {
    return this.http.get<Agent[]>(this.baseUrl + 'agents');
  }

  getAgentByUsername(username: string): Observable<Agent> {
    return this.http.get<Agent>(`${this.baseUrl}agents/${username}`);
  }

  updateAgent(agent: updateAgent): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}agents/${agent.id}`, agent);
  }

  getAllBranches(): Observable<Branch[]> {
    return this.http.get<Branch[]>(this.baseUrl + 'branches');
  }

}
