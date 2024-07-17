import { importProvidersFrom, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { CommonModule } from '@angular/common';
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
import { ReportListComponent } from './report-list/report-list.component';
import { ViewReportComponent } from './view-report/view-report.component';
import { RespondentListComponent } from './respondents-list/respondents-list.component';
import { NgxSpinnerComponent, NgxSpinnerModule } from 'ngx-spinner';
import { loadingInterceptor } from './_interceptors/loading.interceptor';
import { jwtInterceptor } from './_interceptors/auth.interceptor';
import { NewReportComponent } from './new-report/new-report.component';
import { ToastrModule } from 'ngx-toastr';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

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
    RespondentListComponent,
    NewReportComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    ReactiveFormsModule,
    AppRoutingModule,
    CommonModule,
    FormsModule,
    NgxSpinnerComponent,
    MatAutocompleteModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    ModalModule.forRoot(),
    BsDropdownModule.forRoot(),
    ToastrModule.forRoot({
      timeOut: 5000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true})
  ],
  providers: [
    provideHttpClient(
      withInterceptors([jwtInterceptor, loadingInterceptor])),
    provideAnimations(),
    importProvidersFrom(NgxSpinnerModule)
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
