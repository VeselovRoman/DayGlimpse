import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AgentDetailComponent } from './agent-detail/agent-detail.component';
import { AgentListComponent } from './agent-list/agent-list.component';
import { BranchListComponent } from './branch-list/branch-list.component';
import { AddReportComponent } from './add-report/add-report.component';
import { ReportListComponent } from './report-list/report-list.component';
import { ViewReportComponent } from './view-report/view-report.component';
import { AuthGuard } from './_guards/auth.guard';
import { HomeComponent } from './home/home.component';
import { RespondentListComponent } from './respondents-list/respondents-list.component';

const routes: Routes = [
  
  { path: 'agents', component: AgentListComponent },
  { path: 'respondents', component: RespondentListComponent },
  { path: 'reports', component: ReportListComponent },
  { path: 'branches', component: BranchListComponent },
  { path: 'reports/:id/edit', component: ViewReportComponent },
  { path: 'agents/:id', component: AgentDetailComponent },
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '' } // Перенаправляем на домашнюю страницу для неизвестных маршрутов
  
  //{ path: '', redirectTo: '/reports', pathMatch: 'full' }
  
  /*
  //{ path: 'respondents', component: RespondentsComponent, canActivate: [AuthGuard] },
  { path: 'add-report', component: AddReportComponent },
  { path: 'view-report/:reportId', component: ViewReportComponent },
  
  { path: 'reports', component: ReportListComponent, canActivate: [AuthGuard] },*/
 

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
