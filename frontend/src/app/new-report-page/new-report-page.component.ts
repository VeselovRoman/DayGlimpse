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
    this.newReportForm = this.formBuilder.group({
      agentName: [{ value: this.agentName, disabled: true }],
      reportDate: [{ value: this.getUTCTimeString(), disabled: true }],
      respondentName: ['', Validators.required]
    });
  }

  getUTCTimeString(): string {
    const now = new Date();
    const tzOffset = now.getTimezoneOffset() * 60000; // Offset in milliseconds
    const utcTime = now.getTime() - tzOffset; // UTC time in milliseconds
  
    const utcDate = new Date(utcTime);
    const utcDateString = utcDate.toISOString().slice(0, 16); // Format as yyyy-MM-ddTHH:mm
  
    return utcDateString;
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
