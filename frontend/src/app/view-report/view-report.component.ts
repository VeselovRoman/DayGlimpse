import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ReportService } from '../_services/report.service';
import { RespondentService } from '../_services/respondent.service';
import { ProcedureService } from '../_services/procedure.service';
import { Respondent } from '../_models/respondent';
import { Entry, Report } from '../_models/report';
import { Procedure } from '../_models/procedures';
import { formatDate } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ReportStateService } from '../_services/report-state.service';

@Component({
  selector: 'app-view-report',
  templateUrl: './view-report.component.html',
  styleUrls: ['./view-report.component.css']
})
export class ViewReportComponent implements OnInit {
  reportForm!: FormGroup;
  respondents: Respondent[] = [];
  procedures: Procedure[] = [];
  reportId!: number;
  report!: Report;

  constructor(
    private formBuilder: FormBuilder,
    private reportService: ReportService,
    private respondentService: RespondentService,
    private procedureService: ProcedureService,
    private route: ActivatedRoute,
    private router: Router,
    private reportStateService: ReportStateService // Добавлен сервис состояния
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.reportId = +params['id'];
      this.loadReport();
    });
    this.initializeForm();
    this.loadRespondents();
    this.loadProcedures();
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
  }

  loadReport() {
    this.reportService.getReport(this.reportId).subscribe(report => {
      this.report = report;
      this.fillReportForm()
    });
  }

  fillReportForm(): void {
    if (!this.report) {
      console.log('Report is not loaded yet');
      return;
    }

    console.log("fillReport:", this.report);
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
    entriesFormArray.clear();
    console.log('this.report:', this.report);

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

  addProcedureEntry(): void {
    const entriesFormArray = this.reportForm.get('entries') as FormArray;
    entriesFormArray.push(this.createProcedureEntry());
  }

  createProcedureEntry(entry?: Entry): FormGroup {
    return this.formBuilder.group({
      id: [{ value: entry?.id, disabled: false }],
      procedureId: [{ value: entry?.procedureId, disabled: false }],
      startTime: [this.formatDate(entry?.startTime)], // Преобразование строки в Date и затем в строку
      endTime: [this.formatDate(entry?.endTime)],     // Преобразование строки в Date и затем в строку
      comment: [{ value: entry?.comment, disabled: false }],
      isConfirmed: [{ value: entry?.isConfirmed || false, disabled: false }],
    });
  }

  // Метод для преобразования строки в Date и затем в строку
  formatDate(date: Date | undefined): string {
    if (!date) {
      return ''; // или возврат по умолчанию, если необходимо
    }
    // Пример форматирования в формат yyyy-MM-ddTHH:mm
    return formatDate(date, 'yyyy-MM-ddTHH:mm', 'ru');
  }

  get entries(): FormArray {
    return this.reportForm.get('entries') as FormArray;
  }

  submitReport(): void {
    console.log('Submitting report started');

    if (this.reportForm.invalid) {
      console.log('Form is invalid');
      return;
    }

    const updatedReportEntries = this.reportForm.value.entries.map((entry: any) => ({
      procedureId: entry.procedureId,
      startTime: new Date(entry.startTime),
      endTime: new Date(entry.endTime),
      comment: entry.comment,
      isConfirmed: true
    }));

    this.reportForm.value.entries.forEach((entry: any, index: number) => {
      // добавляем данные отчета
      const entryData = {
        ...updatedReportEntries[index],
        reportId: this.report?.id,
        agentID: this.report?.agentId,
        respondentId: this.report?.respondentId,
      };

      if (entry.id) {
        // Если у записи есть ID, подтверждаем ее
        this.reportService.confirmReportEntry(this.report!.id!, entry.id).subscribe({
          next: () => {
            console.log('Entry confirmed successfully');
          },
          error: error => {
            console.error('Error confirming entry:', error);
          }
        });
      } else {
        // Если у записи нет ID, создаем новую запись
        this.reportService.createReportEntry(this.report!.id!, entryData).subscribe({
          next: (newEntry: Entry) => {
            console.log('Entry added successfully:', newEntry);
          },
          error: error => {
            console.error('Error adding entry:', error);
          }
        });
      }
    });

    // Подтверждаем отчет
    if (this.report?.id) {
      this.reportService.confirmReport(this.report.id).subscribe({
        next: () => {
          console.log('Report confirmed successfully');
          // Загружаем обновленные отчеты перед навигацией
          this.reportStateService.loadReports();
          this.router.navigate(['/reports']); // Возвращаемся к списку отчетов
        },
        error: error => {
          console.error('Error confirming report:', error);
        }
      });
      this.router.navigate(['/reports']); // Возвращаемся к списку отчето
    }
  }

  closeViewReport() {
    // Загружаем обновленные отчеты перед навигацией
    this.reportStateService.loadReports();
    this.router.navigate(['/reports']); // Возвращаемся к списку отчетов
  }
}