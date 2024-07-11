import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, provideHttpClient } from '@angular/common/http';
import { JwtInterceptor } from './auth.interceptor';
import { CommonModule, DatePipe } from '@angular/common';
import { NavComponent } from './nav/nav.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BranchListComponent } from './branch-list/branch-list.component';
// Импорт модулей ngx-bootstrap
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { AgentDetailComponent } from './agent-detail/agent-detail.component';
import { AgentListComponent } from './agent-list/agent-list.component';
import { AddReportComponent } from './add-report/add-report.component';
import { ReportService } from './_services/report.service';
import { RespondentService } from './_services/respondent.service';
import { ReportListComponent } from './report-list/report-list.component';
import { ViewReportComponent } from './view-report/view-report.component';
import { RespondentListComponent } from './respondents-list/respondents-list.component';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    BranchListComponent,
    HomeComponent,
    RegisterComponent,
    AgentListComponent,
    AgentDetailComponent,
    AddReportComponent,
    ReportListComponent,
    ViewReportComponent,
    RespondentListComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    ReactiveFormsModule,
    AppRoutingModule,
    CommonModule,
    FormsModule,
    ModalModule.forRoot(),
    BsDropdownModule.forRoot()
  ],
  providers: [
    provideClientHydration(),
    provideHttpClient(),
    provideAnimations(),
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    [ReportService, RespondentService, DatePipe]
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
