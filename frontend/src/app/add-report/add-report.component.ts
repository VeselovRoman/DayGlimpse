import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { AccountService } from '../_services/account.service';
import { ReportService } from '../_services/report.service';
import { Agent } from '../_models/agent';
import { Respondent } from '../_models/respondent';
import { RespondentService } from '../_services/respondent.service';
import { CreateReportDto, CreateReportEntryDto } from '../_dto/report.dto';
import { Entry } from '../_models/entry';

@Component({
  selector: 'app-add-report',
  templateUrl: './add-report.component.html',
  styleUrls: ['./add-report.component.css']
})
export class AddReportComponent implements OnInit {
  reportForm!: FormGroup;
  currentUser: Agent | null = null;
  respondents: Respondent[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private accountService: AccountService,
    private reportService: ReportService,
    private respondentService: RespondentService
  ) { }

  ngOnInit(): void {
    this.currentUser = this.accountService.currentAgentValue();

    this.reportForm = this.formBuilder.group({
      reportNumber: [null, Validators.required],
      reportDate: [new Date(), Validators.required],
      respondentId: [null, Validators.required],
      entries: this.formBuilder.array([])
    });

    this.loadRespondents();
  }

  loadRespondents() {
    this.respondentService.getRespondents().subscribe(respondents => {
      this.respondents = respondents;
    });
  }

  addProcedureEntry() {
    const entries = this.reportForm.get('entries') as FormArray;
    entries.push(this.createProcedureEntry());
  }

  createProcedureEntry(): FormGroup {
    return this.formBuilder.group({
      procedureName: ['', Validators.required],
      startTime: [null, Validators.required],
      endTime: [null, Validators.required],
      comment: ['']
    });
  }

  submitReport() {
    if (this.reportForm.invalid) {
      return;
    }

    if (!this.currentUser) {
      console.error('Current user is not logged in');
      return;
    }

    const createReportDto: CreateReportDto = {
      respondentId: this.reportForm.value.respondentId
    };

    this.reportService.createReport(createReportDto).subscribe({
      next: (reportResponse) => {
        console.log('Report created successfully:', reportResponse);

        const entries: Entry[] = this.reportForm.value.entries;
        entries.forEach((entry: Entry) => {
          const createReportEntryDto: CreateReportEntryDto = {
            procedureId: entry.procedureId,
            startTime: entry.startTime,
            endTime: entry.endTime,
            comment: entry.comment
          };

          this.reportService.createReportEntry(reportResponse.id, createReportEntryDto).subscribe({
            next: (entryResponse) => {
              console.log('Report entry created successfully:', entryResponse);
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
