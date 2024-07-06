import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AgentDetailComponent } from './agent-detail/agent-detail.component';
import { AgentListComponent } from './agent-list/agent-list.component';
import { BranchListComponent } from './branch-list/branch-list.component';
import { AddReportComponent } from './add-report/add-report.component';
import { ReportListComponent } from './report-list/report-list.component';
import { AuthGuard } from './_guards/auth.guard';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: 'agents', component: AgentListComponent },
  //{ path: 'respondents', component: RespondentsComponent, canActivate: [AuthGuard] },
  { path: 'agents/:id', component: AgentDetailComponent },
  { path: 'branches', component: BranchListComponent },
  { path: 'add-report', component: AddReportComponent, canActivate: [AuthGuard] },
  { path: 'reports', component: ReportListComponent, canActivate: [AuthGuard] },
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  //{ path: 'login', component: LoginComponent },
  { path: '**', redirectTo: '' } // Перенаправляем на домашнюю страницу для неизвестных маршрутов
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
