import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { ReportService } from '../_services/report.service';
import { RespondentService } from '../_services/respondent.service';
import { ProcedureService } from '../_services/procedure.service';
import { Respondent } from '../_models/respondent';
import { Entry, Report } from '../_models/report';
import { Procedure } from '../_models/procedures';
import { formatDate } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ReportStateService } from '../_services/report-state.service';
import { ToastrService } from 'ngx-toastr';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { map, Observable, startWith } from 'rxjs';

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
  timeGaps: { start: Date, end: Date, gap: boolean }[] = [];
  filteredProcedures!: Observable<Procedure[]>;
  formControl = new FormControl();

  constructor(
    private formBuilder: FormBuilder,
    private reportService: ReportService,
    private respondentService: RespondentService,
    private procedureService: ProcedureService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private reportStateService: ReportStateService //сервис состояния
  ) {
    this.loadProcedures();
    this.loadRespondents();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.reportId = +params['id'];
      this.loadReport();
    });
    this.initializeForm();
    this.setupProcedureFilter();
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

  private setupProcedureFilter(): void {
    /*this.filteredProcedures = this.reportForm.get('entries')!.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.procedureName),
        map(procedureName => procedureName ? this.filterProcedures(procedureName) : this.procedures.slice())
      );
      console.log("this.filteredProcedures ", this.filteredProcedures)
  }*/
    this.filteredProcedures = this.formControl.valueChanges.pipe(
      startWith(''),
      map(value => this.filterProcedures(value))
    );
  }

    private filterProcedures(name: string | number): Procedure[] {
      const filterValue = name.toString().toLowerCase();
      return this.procedures.filter(procedure =>
        procedure.name.toLowerCase().includes(filterValue)
      );
    }

  displayProcedureName(procedure: Procedure): string {
    if (procedure) {
      return `${procedure.id} - ${procedure.name}`;
    } else {
      return '';
    }
  }

  displayProcedure(procedure: Procedure) {
    return procedure ? procedure.name : undefined;
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
    this.calculateTimeGaps();
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
        console.log("Загруженные процедуры ", this.procedures)
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

  removeProcedureEntry(index: number): void {
    const entryId = this.entries.at(index).get('id')?.value;
    if (entryId) {
      this.reportService.deleteReportEntry(this.report.id, entryId).subscribe({
        next: () => {
          //console.log('Entry deleted successfully');
          this.toastr.info('Запись успешно удалена')
          this.entries.removeAt(index);
        },
        error: error => {
          this.toastr.error(error.error);
          //console.error('Error deleting entry:', error);
        }
      });
    } else {
      this.entries.removeAt(index);
    }
    this.calculateTimeGaps(); // Пересчитать временные интервалы после удаления
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

    for (let entry of updatedReportEntries) {
      if (!this.checkTimeGapWithinEntry(entry)) {
        console.log('Time gap within entry validation failed');
        this.toastr.error('Некоторые записи начинаются позже (> 5 мин), чем заканчиваются предыдущие')
        // Логика отображения предупреждения пользователю
        return;
      }
    }

    if (!this.checkTimeGapsBetweenEntries(updatedReportEntries)) {
      console.log('Time gaps between entries validation failed');
      // Логика отображения предупреждения пользователю
      return;
    }

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
      this.router.navigate(['/reports']); // Возвращаемся к списку отчетов
    }
  }

  saveReport() {
    console.log('Saving report started');

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

    for (let entry of updatedReportEntries) {
      if (!this.checkTimeGapWithinEntry(entry)) {
        this.toastr.error('Некоторые записи имеют некорректные начало и окончание')
        //console.log('Time gap within entry validation failed');
        // Логика отображения предупреждения пользователю
        //return;
      }
    }

    if (!this.checkTimeGapsBetweenEntries(updatedReportEntries)) {
      this.toastr.error('Некоторые записи начинаются позже (> 5 мин), чем заканчиваются предыдущие')
      //console.log('Time gaps between entries validation failed');
      // Логика отображения предупреждения пользователю
      //return;
    }

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
        this.reportService.updateReportEntry(this.report!.id!, entry.id, entryData).subscribe({
          next: () => {
            this.toastr.info('Запись успешно обновлена')
            console.log('Entry updated successfully');
          },
          error: error => {
            console.error('Error updating entry:', error);
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
    this.calculateTimeGaps();
    this.toastr.info('Отчет успешно сохранен')

  }

  /*checkTimeGapWithinEntry(entry: any): boolean {
    const startTime = new Date(entry.startTime);
    const endTime = new Date(entry.endTime);
    return !!startTime && !!endTime && startTime < endTime;
  }

  checkTimeGapsBetweenEntries(entries: any[]): boolean {
    for (let i = 1; i < entries.length; i++) {
      const previousEndTime = new Date(entries[i - 1].endTime);
      const currentStartTime = new Date(entries[i].startTime);
      const timeDifference = (currentStartTime.getTime() - previousEndTime.getTime()) / (1000 * 60);
      if (timeDifference > 5) {
        return false;
      }
    }
    return true;
  }*/

  hasTimeGapWarning(index: number): boolean {
    const entries = this.entries;
    if (index === 0) {
      return false; // Первая запись не имеет предыдущей для проверки
    }
    const currentEntry = entries.at(index).value;
    const previousEntry = entries.at(index - 1).value;

    if (!currentEntry.startTime || !previousEntry.endTime) {
      return false;
    }

    const currentStartTime = new Date(currentEntry.startTime);
    const previousEndTime = new Date(previousEntry.endTime);

    const timeDifference = (currentStartTime.getTime() - previousEndTime.getTime()) / 60000; // Разница в минутах

    return timeDifference > 5;
  }

  closeViewReport() {
    // Загружаем обновленные отчеты перед навигацией
    this.reportStateService.loadReports();
    this.router.navigate(['/reports']); // Возвращаемся к списку отчетов
  }

  calculateTimeGaps(): void {
    const entries = this.reportForm.value.entries;

    if (entries.length === 0) {
      this.timeGaps = [];
      return;
    }

    const sortedEntries = entries
      .map((entry: any) => ({
        startTime: new Date(entry.startTime),
        endTime: new Date(entry.endTime)
      }))
      .sort((a: any, b: any) => a.startTime.getTime() - b.startTime.getTime());

    const timeGaps = [];

    for (let i = 0; i < sortedEntries.length - 1; i++) {
      const currentEntry = sortedEntries[i];
      const nextEntry = sortedEntries[i + 1];

      const gapStart = new Date(currentEntry.endTime);
      const gapEnd = new Date(nextEntry.startTime);

      const timeDifference = (gapEnd.getTime() - gapStart.getTime()) / (1000 * 60); // Разница в минутах

      if (timeDifference > 5) {
        timeGaps.push({ start: gapStart, end: gapEnd, gap: true }); // Разрыв более 5 минут
      } else {
        timeGaps.push({ start: gapStart, end: gapEnd, gap: false }); // Разрыв до 5 минут
      }
    }

    this.timeGaps = timeGaps;
  }



  getTimeGapStyles(gap: { start: Date, end: Date, gap: boolean }): { [klass: string]: any } {
    const totalDuration = this.timeGaps[this.timeGaps.length - 1].end.getTime() - this.timeGaps[0].start.getTime();
    const startPercent = ((gap.start.getTime() - this.timeGaps[0].start.getTime()) / totalDuration) * 100;
    const widthPercent = ((gap.end.getTime() - gap.start.getTime()) / totalDuration) * 100;
    let backgroundColor = 'lightgray'; // По умолчанию светло-серый цвет для разрывов до 5 минут

    if (gap.gap) {
      backgroundColor = 'lightcoral'; // Светло-красный цвет для разрывов более 5 минут
    }

    return {
      'position': 'absolute',
      'height': '100%',
      'left': `${startPercent}%`,
      'width': `${widthPercent}%`,
      'background-color': backgroundColor
    };
  }



  checkTimeGapsBetweenEntries(entries: any[]): boolean {
    const sortedEntries = entries
      .map(entry => ({
        startTime: new Date(entry.startTime),
        endTime: new Date(entry.endTime)
      }))
      .sort((a, b) => a.startTime.getTime() - b.startTime.getTime());

    for (let i = 0; i < sortedEntries.length - 1; i++) {
      const gap = sortedEntries[i + 1].startTime.getTime() - sortedEntries[i].endTime.getTime();
      if (gap > 5 * 60 * 1000) {
        return false;
      }
    }
    return true;
  }

  checkTimeGapWithinEntry(entry: any): boolean {
    const startTime = new Date(entry.startTime).getTime();
    const endTime = new Date(entry.endTime).getTime();
    return endTime >= startTime;
  }


}