import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RespondentService } from '../_services/respondent.service';
import { ReportService } from '../_services/report.service';
import { CreateReportDto } from '../_dto/report.dto';
import { Respondent } from '../_models/respondent';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-new-report-page',
  templateUrl: './new-report-page.component.html',
  styleUrls: ['./new-report-page.component.css']
})
export class NewReportPageComponent implements OnInit {
  newReportForm!: FormGroup;
  respondents: Respondent[] = [];
  agentId: number;
  agentName: string;

  constructor(
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private respondentService: RespondentService,
    private reportService: ReportService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.getAgentInfo();
    this.initializeForm();
    this.loadRespondents();
  }

  initializeForm(): void {
    const now = new Date();
    const localDateTime = this.getLocalDateTimeString(now);

    this.newReportForm = this.formBuilder.group({
      agentName: [{ value: this.agentName, disabled: true }],
      reportDate: [{ value: localDateTime, disabled: true }],
      respondentName: ['', Validators.required]
    });
  }

  getLocalDateTimeString(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2); // Add leading zero
    const day = ('0' + date.getDate()).slice(-2); // Add leading zero
    const hours = ('0' + date.getHours()).slice(-2); // Add leading zero
    const minutes = ('0' + date.getMinutes()).slice(-2); // Add leading zero
  
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  getAgentInfo(): void {
    this.agentId = this.authService.getAgentId();
    this.agentName = this.authService.getFullName();
  }

  loadRespondents(): void {
    this.respondentService.getRespondents().subscribe(respondents => {
      this.respondents = respondents;
    });
  }

  submitForm(): void {
    if (this.newReportForm.invalid) {
      this.snackBar.open('Пожалуйста, заполните все обязательные поля.', 'Закрыть', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['snackbar-error']
      });
      return;
    }

    const formData = this.newReportForm.getRawValue();
    const newReport: CreateReportDto = {
      reportDate: formData.reportDate,
      agentId: this.agentId,
      respondentId: formData.respondentName
    };

    this.reportService.createReport(newReport).subscribe({
      next: (createdReport) => {
        this.snackBar.open('Отчет успешно создан', 'Закрыть', {
          duration: 3000,
          panelClass: ['snackbar-success']
        });
        this.router.navigate(['/reports', createdReport.id, 'edit']);
      },
      error: () => {
        this.snackBar.open('Ошибка при создании отчета.', 'Закрыть', {
          duration: 5000,
          panelClass: ['snackbar-error']
        });
      }
    });
  }

  onCancel() {
    this.router.navigate(['/reports'])
  }
}
