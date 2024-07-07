import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { AccountService } from '../_services/account.service';
import { ReportService } from '../_services/report.service';
import { Agent } from '../_models/agent';
import { Respondent } from '../_models/respondent';
import { RespondentService } from '../_services/respondent.service';
import { CreateReportDto, CreateReportEntryDto } from '../_dto/report.dto';
import { Entry } from '../_models/entry';
import { ProcedureDto } from '../_dto/procedure.dto';
import { ProcedureService } from '../_services/procedure.service';

@Component({
  selector: 'app-add-report',
  templateUrl: './add-report.component.html',
  styleUrls: ['./add-report.component.css']
})
export class AddReportComponent implements OnInit {
  reportForm!: FormGroup;
  currentUser: Agent | null = null;
  respondents: Respondent[] = [];
  procedures: ProcedureDto[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private accountService: AccountService,
    private reportService: ReportService,
    private respondentService: RespondentService,
    private procedureService: ProcedureService
  ) { }

  ngOnInit(): void {
    this.currentUser = this.accountService.currentAgentValue();

    this.reportForm = this.formBuilder.group({
      reportDate: [new Date(), Validators.required],
      respondentId: [null, Validators.required],
      entries: this.formBuilder.array([])
    });

    this.setDefaultReportDate();
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

  setDefaultReportDate() {
    const today = new Date();
    const todayString = today.toISOString().substring(0, 10); // Формат YYYY-MM-DD
    this.reportForm.get('reportDate')?.setValue(todayString);
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


  addProcedureEntry() {
    const entries = this.reportForm.get('entries') as FormArray;
    entries.push(this.createProcedureEntry());
  }

  createProcedureEntry(): FormGroup {
    return this.formBuilder.group({
      procedureId: ['', Validators.required],
      startTime: [null, Validators.required],
      endTime: [null, Validators.required],
      comment: ['']
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

    if (!this.currentUser) {
      console.error('Current user is not logged in');
      return;
    }

    console.error('Current user is: ' + this.currentUser.agentName);

    const createReportDto: CreateReportDto = {
      reportDate: this.reportForm.value.reportDate,
      agentId: this.currentUser.id,  // Use agentId from the logged-in user,
      respondentId: this.reportForm.value.respondentId
    };

    console.log('Data to be saved:', createReportDto); // Log the data to the console

    this.reportService.createReport(createReportDto).subscribe({
      next: (reportResponse) => {
        console.log('Report created successfully:', reportResponse.id);

        // Log the ReportDto to the console
        console.log('ReportDto:', {
          id: reportResponse.id,
          reportDate: reportResponse.reportDate,
          agentId: reportResponse.agentId,
          respondentId: reportResponse.respondentId
        });

        const entries: Entry[] = this.reportForm.value.entries;
        entries.forEach((entry: Entry) => {
          const createReportEntryDto: CreateReportEntryDto = {
            agentId: reportResponse.agentId,
            respondentId: reportResponse.respondentId,
            procedureId: entry.procedureId,
            startTime: entry.startTime,
            endTime: entry.endTime,
            comment: entry.comment,
            reportId: reportResponse.id
          };

          console.log('Entry to be saved:', createReportEntryDto); // Log each entry before saving

          this.reportService.createReportEntry(reportResponse.id, createReportEntryDto).subscribe({
            next: (entryResponse) => {
              console.log('Report entry created successfully:', entryResponse);

              // Log each created entry
              console.log('Created entry:', {
                _reportId: reportResponse.id,
                ...entryResponse
              });
            },
            error: (error) => {
              console.error('Error creating report entry:', error);
            }
          });
        });

        this.reportForm.reset();
      },
      error: (error) => {
        console.error('Error creating report:', error);
      }
    });
  }
}
