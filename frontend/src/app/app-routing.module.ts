import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AgentDetailComponent } from './agent-detail/agent-detail.component';
import { AgentListComponent } from './agent-list/agent-list.component';
import { BranchListComponent } from './branch-list/branch-list.component';
import { AddReportComponent } from './add-report/add-report.component';

const routes: Routes = [
  { path: 'agents', component: AgentListComponent },
  { path: 'agents/:id', component: AgentDetailComponent },
  { path: 'branches', component: BranchListComponent },
  { path: 'add-report', component: AddReportComponent }
 // { path: '', redirectTo: '/agents', pathMatch: 'full' }, // Добавляем путь по умолчанию
 // { path: '**', redirectTo: '/agents', pathMatch: 'full' } // Добавляем путь для обработки неизвестных маршрутов
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
