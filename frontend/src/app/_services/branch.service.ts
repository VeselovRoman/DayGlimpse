import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BranchService {
  private apiUrl = 'https://localhost:5001/api/';

  constructor(private http: HttpClient) {}

  getBranches(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + 'branches');
  }

  getBranch(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl + 'branches'}/${id}`);
  }

  addBranch(branchDto: any): Observable<any> {
    console.log(branchDto);
    return this.http.post<any>(this.apiUrl + 'branches/register', branchDto);
  }

  updateBranch(branch: any): Observable<any> {
    console.log(branch);
    return this.http.put<any>(this.apiUrl + 'branches/' + branch.id, branch);
  }

  deleteBranch(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
