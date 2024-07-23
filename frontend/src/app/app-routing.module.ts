import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AgentDetailComponent } from './agent-detail/agent-detail.component';
import { AgentListComponent } from './agent-list/agent-list.component';
import { BranchListComponent } from './branch-list/branch-list.component';
import { ReportListComponent } from './report-list/report-list.component';
import { ViewReportComponent } from './view-report/view-report.component';
import { AuthGuard } from './_guards/auth.guard';
import { HomeComponent } from './home/home.component';
import { RespondentListComponent } from './respondents-list/respondents-list.component';
import { NewReportComponent } from './new-report/new-report.component';

const routes: Routes = [
  
  { path: 'agents', component: AgentListComponent, canActivate: [AuthGuard] },
  { path: 'respondents', component: RespondentListComponent, canActivate: [AuthGuard] },
  { path: 'reports', component: ReportListComponent, canActivate: [AuthGuard] },
  { path: 'branches', component: BranchListComponent, canActivate: [AuthGuard] },
  { path: 'reports/new', component: NewReportComponent },
  { path: 'reports/:id/edit', component: ViewReportComponent, canActivate: [AuthGuard] },
  { path: 'agents/:id', component: AgentDetailComponent, canActivate: [AuthGuard] },
  { path: '', component: HomeComponent },
  { path: '**', redirectTo: '' } // Перенаправляем на домашнюю страницу для неизвестных маршрутов
  
  //{ path: '', redirectTo: '/reports', pathMatch: 'full' }
  
  /*
  //{ path: 'respondents', component: RespondentsComponent, canActivate: [AuthGuard] },
  { path: 'view-report/:reportId', component: ViewReportComponent },*/
  
 

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
