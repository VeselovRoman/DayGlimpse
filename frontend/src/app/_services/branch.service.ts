import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Branch } from '../_models/branch';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BranchService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getBranches(): Observable<Branch[]> {
    return this.http.get<Branch[]>(this.apiUrl + 'branches');
  }

  getBranch(id: number): Observable<Branch> {
    return this.http.get<Branch>(`${this.apiUrl + 'branches'}/${id}`);
  }

  addBranch(branchDto: any): Observable<Branch> {
    console.log(branchDto);
    return this.http.post<Branch>(this.apiUrl + 'branches/register', branchDto);
  }

  updateBranch(branch: any): Observable<Branch> {
    console.log(branch);
    return this.http.put<Branch>(this.apiUrl + 'branches/' + branch.id, branch);
  }

  deleteBranch(id: number): Observable<Branch> {
    return this.http.delete<Branch>(`${this.apiUrl}branches/${id}`);
  }
}
