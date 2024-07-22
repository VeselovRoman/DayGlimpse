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
import { catchError, forkJoin, map, Observable, of, retry, startWith } from 'rxjs';
import { CreateReportEntryDto } from '../_dto/report.dto';

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
  filteredProcedures: { [key: number]: Observable<Procedure[]> } = {};

  constructor(
    private formBuilder: FormBuilder,
    private reportService: ReportService,
    private respondentService: RespondentService,
    private procedureService: ProcedureService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private reportStateService: ReportStateService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.reportId = +params['id'];
      this.loadReport();
    });
    this.initializeForm();
    this.loadProcedures();
    this.loadRespondents();
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

  loadReport(): void {
    this.reportService.getReport(this.reportId).subscribe(report => {
      this.report = report;
      this.fillReportForm();
    });
  }

  setupProcedureFilter(index: number): void {
    const control = this.entries.at(index).get('procedureName') as FormControl;
    this.filteredProcedures[index] = control.valueChanges.pipe(
      startWith(''),
      map(value => this._filterProcedures(value))
    );
  }

  onProcedureInput(index: number): void {
    this.setupProcedureFilter(index);
  }

  displayProcedure(procedure: Procedure): string {
    return procedure && procedure.name ? procedure.name : '';
  }

  private _filterProcedures(value: string): Procedure[] {
    if (typeof value !== 'string') {
      return [];
    }
    const filterValue = value.toLowerCase();
    return this.procedures.filter(procedure =>
      typeof procedure.name === 'string' && procedure.name.toLowerCase().includes(filterValue)
    );
  }

  fillReportForm(): void {
    if (!this.report) {
      console.log('Report is not loaded yet');
      return;
    }

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

    if (this.report && this.report.reportEntries) {
      this.report.reportEntries.forEach((entry, index) => {
        entriesFormArray.push(this.createProcedureEntry(entry));
        this.setupProcedureFilter(index);
      });
    } else {
      console.log('No report entries found.');
    }
    // Вывод entriesFormArray после заполнения
    console.log('entriesFormArray после заполнения:', entriesFormArray);
  }

  loadRespondents(): void {
    this.respondentService.getRespondents().subscribe({
      next: respondents => this.respondents = respondents,
      error: error => this.toastr.error('Ошибка загрузки респондентов')
    });
  }

  /*loadProcedures(): void {
    this.procedureService.getProcedures().subscribe({
      next: procedures => this.procedures = procedures,
      error: error => this.toastr.error('Ошибка загрузки процедур')
    });
  }*/

  loadProcedures(): void {
    this.procedureService.getProcedures().pipe(
      retry(3), // Попытка повторить запрос до 3 раз в случае ошибки
      catchError(error => {
        this.toastr.error('Ошибка загрузки процедур');
        return of([]); // Возвращает пустой массив в случае окончательной ошибки
      })
    ).subscribe({
      next: procedures => this.procedures = procedures,
      error: error => console.error('Error loading procedures after retries:', error)
    });
  }

  refreshReportAndProcedures(): void {
    this.loadReport();
    this.loadProcedures();
  }

  addProcedureEntry(): void {
    const entriesFormArray = this.reportForm.get('entries') as FormArray;

    // Получаем время окончания последней записи, если она есть
    let lastEndTime: Date = new Date();
    if (entriesFormArray.length > 0) {
      const lastEntry = entriesFormArray.at(entriesFormArray.length - 1).value;
      lastEndTime = new Date(lastEntry.endTime);
    }

    // Устанавливаем время начала новой записи равным времени окончания последней записи
    const startTime = new Date(lastEndTime);
    // Устанавливаем время окончания новой записи на 10 минут позже времени начала
    const endTime = new Date(startTime.getTime() + 10 * 60000);

    entriesFormArray.push(this.createProcedureEntry({
      startTime: startTime,
      endTime: endTime
    }));

    this.setupProcedureFilter(entriesFormArray.length - 1);
  }

  removeProcedureEntry(index: number): void {
    const entryId = this.entries.at(index).get('id')?.value;
    if (entryId) {
      this.reportService.deleteReportEntry(this.report.id, entryId).subscribe({
        next: () => {
          this.toastr.info('Запись успешно удалена');
          this.entries.removeAt(index);
        },
        error: error => this.toastr.error(error.error)
      });
    } else {
      this.entries.removeAt(index);
    }
    this.calculateTimeGaps(); // Пересчитать временные интервалы после удаления
  }

  createProcedureEntry(entry?: Partial<Entry>): FormGroup {
    const now = new Date();
    const tenMinutesLater = new Date(now.getTime() + 10 * 60000); // добавляем 10 минут

    return this.formBuilder.group({
      id: [{ value: entry?.id, disabled: false }],
      procedureId: [{ value: entry?.procedureId, disabled: false }],
      procedureName: [this.procedures.find(p => p.id === entry?.procedureId) || null, Validators.required],
      startTime: [this.formatDate(entry?.startTime || now)], // Преобразование строки в Date и затем в строку
      endTime: [this.formatDate(entry?.endTime || tenMinutesLater)],     // Преобразование строки в Date и затем в строку
      comment: [{ value: entry?.comment, disabled: false }],
      isConfirmed: [{ value: entry?.isConfirmed || false, disabled: false }],
    });
  }

  formatDate(date: Date | undefined): string {
    return date ? formatDate(date, 'yyyy-MM-ddTHH:mm', 'ru') : '';
  }

  get entries(): FormArray {
    return this.reportForm.get('entries') as FormArray;
  }

  submitReport(): void {
    if (this.reportForm.invalid) {
      this.toastr.error('Форма заполнена неверно');
      return;
    }

    const updatedReportEntries: CreateReportEntryDto[] = this.reportForm.value.entries.map((entry: any) => ({
      procedureId: entry.procedureName.id,
      startTime: new Date(entry.startTime),
      endTime: new Date(entry.endTime),
      comment: entry.comment,
      isConfirmed: true
    }));

    if (updatedReportEntries.some((entry: CreateReportEntryDto) => !this.checkTimeGapWithinEntry(entry))) {
      this.toastr.warning('Некоторые записи начинаются позже (> 5 мин), чем заканчиваются предыдущие');
      return;
    }

    if (!this.checkTimeGapsBetweenEntries(updatedReportEntries)) {
      this.toastr.warning('Некоторые записи начинаются позже (> 5 мин), чем заканчиваются предыдущие');
      return;
    }

    const requests: Observable<CreateReportEntryDto | null>[] = this.reportForm.value.entries.map((entry: Entry, index: number) => {
      const entryData = {
        ...updatedReportEntries[index],
        reportId: this.report?.id,
        agentID: this.report?.agentId,
        respondentId: this.report?.respondentId,
      };

      if (entry.id) {
        return this.reportService.updateReportEntry(this.report!.id!, entry.id, entryData).pipe(
          catchError(error => {
            this.toastr.error(`Ошибка обновления записи ID ${entry.id}`);
            return of(null); // Возвращаем null в случае ошибки
          })
        );
      } else {
        return this.reportService.createReportEntry(this.report!.id!, entryData).pipe(
          catchError(error => {
            this.toastr.error('Ошибка добавления записи');
            return of(null); // Возвращаем null в случае ошибки
          })
        );
      }
    });

    forkJoin(requests).subscribe((results: (CreateReportEntryDto | null)[]) => {
      // Обработка результатов после завершения всех запросов
      if (results.every(result => result !== null)) {
        this.toastr.info('Отчет успешно сохранен');
      } else {
        this.toastr.warning('Некоторые записи не были сохранены');
      }
      this.calculateTimeGaps();
    });

    if (this.report?.id) {
      this.reportService.confirmReport(this.report.id).subscribe({
        next: () => {
          this.toastr.info('Отчет успешно подтвержден');
          this.reportStateService.loadReports();
          this.router.navigate(['/reports']);
        },
        error: error => this.toastr.error('Ошибка подтверждения отчета')
      });
    }
  }

  saveReport() {

    if (this.reportForm.invalid) {
      this.toastr.error('Форма заполнена неверно');
      return;
    }
    const updatedReportEntries: CreateReportEntryDto[] = this.reportForm.value.entries.map((entry: any) => ({
      id: entry.id,
      procedureId: entry.procedureName.id,
      startTime: new Date(entry.startTime),
      endTime: new Date(entry.endTime),
      comment: entry.comment,
      isConfirmed: true
    }));

    if (updatedReportEntries.some(entry => !this.checkTimeGapWithinEntry(entry))) {
      this.toastr.error('Некоторые записи имеют некорректные начало и окончание');
      //return;
    }

    if (!this.checkTimeGapsBetweenEntries(updatedReportEntries)) {
      this.toastr.error('Некоторые записи начинаются позже (> 5 мин), чем заканчиваются предыдущие');
      //return;
    }

    this.reportForm.value.entries.forEach((entry: CreateReportEntryDto, index: number) => {
      const entryData = {
        ...updatedReportEntries[index],
        reportId: this.report?.id,
        agentID: this.report?.agentId,
        respondentId: this.report?.respondentId,
      };

      if (entry.id) {
        this.reportService.updateReportEntry(this.report!.id!, entry.id, entryData).subscribe({
          next: () => this.toastr.info('Запись успешно обновлена'),
          error: error => this.toastr.error('Ошибка обновления записи')
        });
      } else {
        this.reportService.createReportEntry(this.report!.id!, entryData).subscribe({
          next: (newEntry: CreateReportEntryDto) => this.toastr.info('Запись успешно добавлена'),
          error: error => this.toastr.error('Ошибка добавления записи')
        });
      }
    });
    this.calculateTimeGaps();
    this.toastr.info('Отчет успешно сохранен')
  }

  hasTimeGapWarning(index: number): boolean {
    if (index === 0) return false;
    const currentEntry = this.entries.at(index).value;
    const previousEntry = this.entries.at(index - 1).value;

    if (!currentEntry.startTime || !previousEntry.endTime) return false;

    const currentStartTime = new Date(currentEntry.startTime);
    const previousEndTime = new Date(previousEntry.endTime);

    const timeDifference = (currentStartTime.getTime() - previousEndTime.getTime()) / 60000;

    return timeDifference > 5;
  }

  closeViewReport(): void {
    this.reportStateService.loadReports();
    this.router.navigate(['/reports']);
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

      const timeDifference = (gapEnd.getTime() - gapStart.getTime()) / (1000 * 60);

      if (timeDifference > 5) {
        timeGaps.push({ start: gapStart, end: gapEnd, gap: true });
      } else {
        timeGaps.push({ start: gapStart, end: gapEnd, gap: false });
      }
    }

    this.timeGaps = timeGaps;
  }

  getTimeGapStyles(gap: { start: Date, end: Date, gap: boolean }): { [klass: string]: any } {
    const totalDuration = this.timeGaps[this.timeGaps.length - 1].end.getTime() - this.timeGaps[0].start.getTime();
    const startPercent = ((gap.start.getTime() - this.timeGaps[0].start.getTime()) / totalDuration) * 100;
    const widthPercent = ((gap.end.getTime() - gap.start.getTime()) / totalDuration) * 100;
    let backgroundColor = 'lightgray';

    if (gap.gap) {
      backgroundColor = 'lightcoral';
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
      if (gap > 5 * 60 * 1000) return false;
    }
    return true;
  }

  checkTimeGapWithinEntry(entry: any): boolean {
    const startTime = new Date(entry.startTime).getTime();
    const endTime = new Date(entry.endTime).getTime();
    return endTime >= startTime;
  }
}
