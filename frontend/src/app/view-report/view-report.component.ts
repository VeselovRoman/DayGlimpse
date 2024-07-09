import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ReportService } from '../_services/report.service';
import { RespondentService } from '../_services/respondent.service';
import { ProcedureService } from '../_services/procedure.service';
import { Respondent } from '../_models/respondent';
import { Entry, Report } from '../_models/report';
import { Procedure } from '../_models/procedures';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-view-report',
  templateUrl: './view-report.component.html',
  styleUrls: ['./view-report.component.css']
})
export class ViewReportComponent implements OnInit {
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
    console.log("ngOnInit:", this.report);
    this.initializeForm();
    this.loadRespondents();
    this.loadProcedures()
  }

  initializeForm(): void {
    this.reportForm = this.formBuilder.group({
      id: [{ value: '', disabled: false }],
      reportDate: [{ value: '', disabled: false }],
      agentName: [{ value: '', disabled: false }],
      respondentName: [{ value: '', disabled: false }],
      isConfirmed: [{ value: '', disabled: false }],
      entries: this.formBuilder.array([])
    });
    console.log('Текущие entries_1:', this.reportForm.get('entries'));

    if (this.report) {
      this.loadReport();
    }
  }

  loadReport(): void {
    console.log("loadReport:", this.report);
    this.reportForm.patchValue({
      id: this.report?.id,
      reportDate: this.report?.reportDate,
      agentName: this.report?.agentName,
      respondentName: this.report?.respondentName,
      isConfirmed: this.report?.isConfirmed
    });
    this.loadReportEntries();
  }

  loadReportEntries(): void {
    const entriesFormArray = this.reportForm.get('entries') as FormArray;
    // Вывод текущего состояния entriesFormArray
    console.log('Текущий entriesFormArray до очистки:', entriesFormArray);

    entriesFormArray.clear();
    console.log('Текущий entriesFormArray после очистки:', entriesFormArray);

    if (this.report && this.report.reportEntries) {
      console.log('Report entries found:', this.report.reportEntries);
      this.report.reportEntries.forEach(entry => {
        console.log('Adding entry:', entry); // Логирование данных записи
        entriesFormArray.push(this.createProcedureEntry(entry));
      });
    } else {
      console.log('No report entries found.');
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
    console.log('Creating procedure entry with:', entry); // Логирование для отладки

    return this.formBuilder.group({
      id: [{ value: entry?.id, disabled: false }],
      procedureId: [{ value: entry?.procedureId, disabled: false }],
      startTime: [this.formatDate(entry?.startTime)], // Преобразование строки в Date и затем в строку
      endTime: [this.formatDate(entry?.endTime)],     // Преобразование строки в Date и затем в строку
      comment: [{ value: entry?.comment, disabled: false }],
      isConfirmed: [{ value: entry?.isConfirmed, disabled: false }],
    });
  }

  // Метод для преобразования строки в Date и затем в строку
  formatDate(date: Date | undefined): string {
    if (!date) {
      return ''; // или возврат по умолчанию, если необходимо
    }
    // Пример форматирования в формат yyyy-MM-ddTHH:mm
    return formatDate(date, 'yyyy-MM-ddTHH:mm', 'en-US');
  }
  
  get entries(): FormArray {
    return this.reportForm.get('entries') as FormArray;
  }
  showEntries() {
    console.log('Текущие entries_1:', this.reportForm.get('entries'));
  }
}