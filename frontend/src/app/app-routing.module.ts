import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AgentListComponent } from './agent-list/agent-list.component';
import { BranchListComponent } from './branch-list/branch-list.component';
import { ReportListComponent } from './report-list/report-list.component';
import { ViewReportComponent } from './view-report/view-report.component';
import { AuthGuard } from './_guards/auth.guard';
import { HomeComponent } from './home/home.component';
import { RespondentListComponent } from './respondents-list/respondents-list.component';
import { CategoryEditorComponent } from './category-editor/category-editor.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { NewReportPageComponent } from './new-report-page/new-report-page.component';

const routes: Routes = [
  
  { path: 'agents', component: AgentListComponent, canActivate: [AuthGuard] },
  { path: 'respondents', component: RespondentListComponent, canActivate: [AuthGuard] },
  { path: 'reports', component: ReportListComponent, canActivate: [AuthGuard] },
  { path: 'branches', component: BranchListComponent, canActivate: [AuthGuard] },
  { path: 'reports/new', component: NewReportPageComponent },
  { path: 'reports/:id/edit', component: ViewReportComponent, canActivate: [AuthGuard] },
  { path: 'categories', component: CategoryEditorComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: UserProfileComponent, canActivate: [AuthGuard] },
  { path: '', component: HomeComponent },
  { path: '**', redirectTo: '' } // Перенаправляем на домашнюю страницу для неизвестных маршрутов
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
