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
import { AgentListComponent } from './agent-list/agent-list.component';
import { ReportListComponent } from './report-list/report-list.component';
import { ViewReportComponent } from './view-report/view-report.component';
import { RespondentListComponent } from './respondents-list/respondents-list.component';
import { NgxSpinnerComponent, NgxSpinnerModule } from 'ngx-spinner';
import { loadingInterceptor } from './_interceptors/loading.interceptor';
import { jwtInterceptor } from './_interceptors/auth.interceptor';
import { NewReportComponent } from './new-report/new-report.component';
import { ToastrModule } from 'ngx-toastr';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatDialogModule } from '@angular/material/dialog';
import { RespondentDialogComponent } from './respondent-dialog/respondent-dialog.component';
import { BranchDialogComponent } from './branch-dialog/branch-dialog.component';
import { AgentDialogComponent } from './agent-dialog/agent-dialog.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CategoryEditorComponent } from './category-editor/category-editor.component';
import { LoginComponent } from './login-component/login-component.component';
import { AuthService } from './_services/auth.service';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    BranchListComponent,
    HomeComponent,
    AgentListComponent,
    ReportListComponent,
    ViewReportComponent,
    RespondentListComponent,
    NewReportComponent,
    RespondentDialogComponent,
    BranchDialogComponent,
    AgentDialogComponent,
    ConfirmDialogComponent,
    CategoryEditorComponent,
    LoginComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    ReactiveFormsModule,
    AppRoutingModule,
    CommonModule,
    FormsModule,
    NgxSpinnerComponent,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatCardModule,
    MatTooltipModule,
    MatDividerModule,
    MatAutocompleteModule,
    MatGridListModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatToolbarModule,
    MatMenuModule,
    MatSnackBarModule,
    ModalModule.forRoot(),
    BsDropdownModule.forRoot(),
    ToastrModule.forRoot({
      timeOut: 5000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true})
  ],
  providers: [
    AuthService,
    provideHttpClient(
      withInterceptors([jwtInterceptor, loadingInterceptor])),
    provideAnimations(),
    importProvidersFrom(NgxSpinnerModule),
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
