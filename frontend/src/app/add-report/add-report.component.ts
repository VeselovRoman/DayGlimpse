import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService } from '../_services/account.service';
import { ReportService } from '../_services/report.service';
import { RespondentService } from '../_services/respondent.service';
import { ProcedureService } from '../_services/procedure.service';
import { Agent } from '../_models/agent';
import { Respondent } from '../_models/respondent';
import { CreateReportDto } from '../_dto/report.dto';
import { Procedure } from '../_models/procedures';

@Component({
  selector: 'app-add-report',
  templateUrl: './add-report.component.html',
  styleUrls: ['./add-report.component.css']
})
export class AddReportComponent implements OnInit {
  reportForm!: FormGroup;
  currentUser: Agent | null = null;
  respondents: Respondent[] = [];
  procedures: Procedure[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private accountService: AccountService,
    private reportService: ReportService,
    private respondentService: RespondentService,
    private procedureService: ProcedureService,
    private router: Router // добавляем Router
  ) { }

  ngOnInit(): void {
    this.currentUser = this.accountService.currentAgentValue();

    this.reportForm = this.formBuilder.group({
      reportDate: [new Date().toISOString().substring(0, 10), Validators.required],
      respondentId: [null, Validators.required],
      entries: this.formBuilder.array([])
    });

    this.loadRespondents();
    this.loadProcedures();
  }

  loadProcedures() {
    this.procedureService.getProcedures().subscribe({
      next: procedures => {
        this.procedures = procedures;
      },
      error: error => {
        console.error('Error loading procedures:', error);
      }
    });
  }

  loadRespondents() {
    this.respondentService.getRespondents().subscribe({
      next: respondents => {
        this.respondents = respondents;
        console.log('Загруженные респонденты:', this.respondents); // console.log внутрь функции next
      },
      error: error => {
        console.error('Error loading respondents:', error);
      }
    });
  }

  get entries(): FormArray {
    return this.reportForm.get('entries') as FormArray;
  }
  
  submitReport() {
    if (this.reportForm.invalid) {
      console.log('this.reportForm.invalid is invalid');
      return;
    }

    const createReportDto: CreateReportDto = {
      reportDate: this.reportForm.value.reportDate,
      agentId: this.currentUser!.id,
      respondentId: this.reportForm.value.respondentId
    };

    console.log('Data to be saved:', createReportDto); // Log the data to the console

    this.reportService.createReport(createReportDto).subscribe({
      next: (reportResponse) => {
        console.log('Report created successfully:', reportResponse.id);
        // Перенаправление пользователя на страницу редактирования отчета
        this.router.navigate(['/edit-report', reportResponse.id]);

        this.reportForm.reset();
      },
      error: (error) => {
        console.error('Error creating report:', error);
      }
    });
  }
}
