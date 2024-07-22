import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService } from '../_services/account.service';
import { RespondentService } from '../_services/respondent.service';
import { Agent } from '../_models/agent';
import { Respondent } from '../_models/respondent';
import { ReportService } from '../_services/report.service';
import { CreateReportDto } from '../_dto/report.dto';

@Component({
  selector: 'app-new-report',
  templateUrl: './new-report.component.html',
  styleUrls: ['./new-report.component.css']
})
export class NewReportComponent implements OnInit {
  newReportForm = this.formBuilder.group({
    reportDate: [new Date().toISOString()],
    respondentId: ['']
  });
  agentId: number = 0;
  agentName: string = '';
  respondents: Respondent[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private respondentService: RespondentService,
    private reportService: ReportService
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.loadRespondents();
    this.getAgentInfo();
  }

  initializeForm(): void {
    this.newReportForm = this.formBuilder.group({
      reportDate: [{ value: this.getUTCTimeString(), disabled: true }],
      respondentId: ['', Validators.required]
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
    // Метод загрузки респондентов
    this.respondentService.getRespondents().subscribe(respondents => {
      this.respondents = respondents;
    });
  }

  submitForm(): void {
    if (this.newReportForm.invalid) {
      console.log('Form is invalid');
      return;
    }

    const formData = this.newReportForm.getRawValue();
    const reportDate: string = formData.reportDate ?? '';
    const respondentId: number = Number(formData.respondentId);

    const newReport: CreateReportDto = {
      reportDate: reportDate,
      agentId: this.agentId,
      respondentId: respondentId
    };
    console.log('Данные нового отчета', newReport);
    // Отправляем данные на сервер через сервис
    this.reportService.createReport(newReport).subscribe({
      next: (createdReport) => {
        console.log('Report created successfully:', createdReport);
        //this.router.navigate(['/reports', createdReport.id]); // Переход на страницу созданного отчета
        this.router.navigate(['/reports']); // Возвращаемся к списку отчетов

      },
      error: (error) => {
        console.error('Error creating report:', error);
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/reports']); // замените '/previous-page' на нужный маршрут
  }
}
