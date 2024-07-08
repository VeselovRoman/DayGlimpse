import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ReportService } from '../_services/report.service';
import { RespondentService } from '../_services/respondent.service';
import { ProcedureService } from '../_services/procedure.service';
import { Respondent } from '../_models/respondent';
import { Entry, Report } from '../_models/report';
import { Procedure } from '../_models/procedures';

@Component({
  selector: 'app-view-report',
  templateUrl: './view-report.component.html',
  styleUrls: ['./view-report.component.css']
})
export class ViewReportComponent implements OnInit, OnChanges {
  @Input() report: Report | null = null;

  reportForm!: FormGroup;
  respondents: Respondent[] = [];
  procedures: Procedure[] = [];


  constructor(
    private formBuilder: FormBuilder,
    private reportService: ReportService,
    private respondentService: RespondentService,
    private procedureService: ProcedureService
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.loadRespondents();
    this.loadProcedures();
    console.log('ngOnInit: @Input report: '+ this.report);

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['report'] && !changes['report'].firstChange) {
      this.initializeForm();
      this.loadRespondents();
      this.loadProcedures();
    }
    console.log('ngOnChanges: @Input report: '+ this.report);

  }

  initializeForm(): void {
    this.reportForm = this.formBuilder.group({
      reportDate: [{ value: '', disabled: true }, Validators.required],
      respondentId: [{ value: '', disabled: true }, Validators.required],
      entries: this.formBuilder.array([])
    });
    console.log('initializeForm: @Input report: '+ this.report);

    if (this.report) {
      this.loadReport();
    }
  }

  loadReport(): void {
    console.log('loadReport: @Input report: '+ this.report);
    
    this.reportForm.patchValue({
      reportDate: this.report?.reportDate,
      respondentId: this.report?.respondentId
    });

    // Проверка значений reportDate и respondentId после их загрузки
    console.log('Loaded reportDate:', this.reportForm.get('reportDate')?.value);
    console.log('Loaded respondentId:', this.reportForm.get('respondentId')?.value);

    this.loadReportEntries();
  }

  loadReportEntries(): void {
    const entriesFormArray = this.reportForm.get('entries') as FormArray;
    // Вывод текущего состояния entriesFormArray
    console.log('Текущий entriesFormArray:', entriesFormArray);

    entriesFormArray.clear();

    if (this.report && this.report.reportEntries) {
      this.report.reportEntries.forEach(entry => {
        entriesFormArray.push(this.createProcedureEntry(entry));
      });
    }
    // Вывод entriesFormArray после заполнения
    console.log('entriesFormArray после заполнения:', entriesFormArray);
  }

  loadRespondents(): void {
    this.respondentService.getRespondents().subscribe({
      next: respondents => {
        this.respondents = respondents;
      },
      error: error => {
        console.error('Error loading respondents:', error);
      }
    });
  }

  loadProcedures(): void {
    this.procedureService.getProcedures().subscribe({
      next: procedures => {
        this.procedures = procedures;
      },
      error: error => {
        console.error('Error loading procedures:', error);
      }
    });
  }

  createProcedureEntry(entry?: Entry): FormGroup {
    return this.formBuilder.group({
      procedureId: [{ value: entry?.procedureId || '', disabled: false }, Validators.required],
      startTime: [{ value: entry?.startTime || '', disabled: false }, Validators.required],
      endTime: [{ value: entry?.endTime || '', disabled: false }, Validators.required],
      comment: [{ value: entry?.comment || '', disabled: false }]
    });
  }

  addProcedureEntry(): void {
    const entriesFormArray = this.reportForm.get('entries') as FormArray;
    entriesFormArray.push(this.createProcedureEntry());
  }

  get entries(): FormArray {
    return this.reportForm.get('entries') as FormArray;
  }

  submitReport(): void {
    if (this.reportForm.invalid) {
      console.log('Form is invalid');
      return;
    }

    const updateReport = {
      id: this.report?.id,
      reportDate: this.reportForm.value.reportDate,
      respondentId: this.reportForm.value.respondentId,
      reportEntries: this.reportForm.value.entries
    };

    this.reportService.confirmReport(updateReport.id!).subscribe({
      next: () => {
        console.log('Report updated successfully');
        // Optionally, navigate back to report list or perform other actions
      },
      error: error => {
        console.error('Error updating report:', error);
      }
    });
  }

}