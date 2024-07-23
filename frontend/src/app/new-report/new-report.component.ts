import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { RespondentService } from '../_services/respondent.service';
import { ReportService } from '../_services/report.service';
import { CreateReportDto } from '../_dto/report.dto';
import { Respondent } from '../_models/respondent';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-new-report',
  templateUrl: './new-report.component.html',
  styleUrls: ['./new-report.component.css']
})
export class NewReportComponent implements OnInit {
  newReportForm!: FormGroup;
  respondents: Respondent[] = [];
  agentId: number;
  agentName: string;

  constructor(
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<NewReportComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private respondentService: RespondentService,
    private reportService: ReportService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.loadRespondents();
    this.getAgentInfo();
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
    const agentJson = localStorage.getItem('agent');
    if (agentJson) {
      const agent = JSON.parse(agentJson);
      this.agentName = agent.agentName;
      this.agentId = agent.id;
      console.log('Agent Name:', this.agentName);
    } else {
      console.log('No agent found in localStorage');
    }
  }

  loadRespondents(): void {
    this.respondentService.getRespondents().subscribe(respondents => {
      this.respondents = respondents;
    });
  }

  submitForm(): void {
    if (this.newReportForm.invalid) {
      this.snackBar.open('Пожалуйста, заполните все обязательные поля.', 'Закрыть', {
        duration: 3000, // Время отображения сообщения в миллисекундах
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['snackbar-error'] // Классы для стилизации сообщения
      });
      return;
    }

    const formData = this.newReportForm.getRawValue();
    const reportDate: string = formData.reportDate;
    const selectedRespondent = formData.respondentName;

    const respondentId = this.newReportForm.get('respondentName')?.value;

    const newReport: CreateReportDto = {
      reportDate: reportDate,
      agentId: this.agentId,
      respondentId: respondentId
    };

    console.log('Данные нового отчета', newReport);
    this.reportService.createReport(newReport).subscribe({
      next: (createdReport) => {
        console.log('Report created successfully:', createdReport);
        this.dialogRef.close();
        this.router.navigate(['/reports', createdReport.id, 'edit']);
      },
      error: (error) => {
        this.snackBar.open('Ошибка при создании отчета.', 'Закрыть', {
          duration: 5000,
          panelClass: ['snackbar-error']
        });
      }
    });
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
