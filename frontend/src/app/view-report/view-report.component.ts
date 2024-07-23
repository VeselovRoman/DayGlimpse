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
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

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
  isCreating: boolean = false;
  isDeleting: boolean[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private reportService: ReportService,
    private respondentService: RespondentService,
    private procedureService: ProcedureService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private reportStateService: ReportStateService,
    private dialog: MatDialog
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

  openConfirmDeleteDialog(index: number) {
    this.isDeleting[index] = true;
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        title: 'Удаление',
        message: 'Вы уверены, что хотите удалить эту запись?',
        confirmButtonText: 'Удалить',
        cancelButtonText: 'Отмена'
      }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.removeProcedureEntry(index);
      } else {
        this.isDeleting[index] = false;
      }
    });
  }

  openConfirmLeaveDialog() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        title: 'Изменения',
        message: 'У вас есть несохраненные изменения. Закрыть?',
        confirmButtonText: 'Закрыть',
        cancelButtonText: 'Отмена'
      }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.reportStateService.loadReports();
          this.router.navigate(['/reports']);
      } else {
        
      }
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
    this.isDeleting = [];

    if (this.report && this.report.reportEntries) {
      this.report.reportEntries.forEach((entry, index) => {
        entriesFormArray.push(this.createProcedureEntry(entry));
        this.setupProcedureFilter(index);
        this.isDeleting.push(false);
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
    this.isCreating = true;
    const entriesFormArray = this.reportForm.get('entries') as FormArray;

    let lastEndTime: Date = new Date();
    if (entriesFormArray.length > 0) {
      const lastEntry = entriesFormArray.at(entriesFormArray.length - 1).value;
      lastEndTime = new Date(lastEntry.endTime);
    }

    const startTime = new Date(lastEndTime);
    const endTime = new Date(startTime.getTime() + 10 * 60000);

    const newEntry = this.createProcedureEntry({
      startTime: startTime,
      endTime: endTime
    });

    const entryData: CreateReportEntryDto = {
      id: 0, // ID будет присвоен сервером
      agentId: this.report.agentId,
      respondentId: this.report.respondentId,
      procedureId: 0,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      comment: '',
      reportId: this.report.id
    };

    this.reportService.createReportEntry(this.report.id, entryData).subscribe({
      next: (createdEntry: CreateReportEntryDto) => {
        newEntry.patchValue({ id: createdEntry.id });
        entriesFormArray.push(newEntry);
        this.setupProcedureFilter(entriesFormArray.length - 1);
        this.toastr.info('Запись успешно добавлена');
        this.isCreating = false;
      },
      error: error => {
        this.toastr.error('Ошибка добавления записи');
        this.isCreating = false; // В случае ошибки создания
      },
      complete: () => this.isCreating = false
    });
  }

  removeProcedureEntry(index: number): void {
    const entryId = this.entries.at(index).get('id')?.value;
    if (entryId) {
      this.reportService.deleteReportEntry(this.report.id, entryId).subscribe({
        next: () => {
          this.toastr.info('Запись успешно удалена');
          this.entries.removeAt(index);
          this.calculateTimeGaps();
          this.isDeleting[index] = false;
        },
        error: error => {
          this.toastr.error(error.error);
          this.isDeleting[index] = false; // В случае ошибки удаления
        },
        complete: () => this.isDeleting[index] = false
      });
    } else {
      this.entries.removeAt(index);
      this.calculateTimeGaps();
      this.isDeleting[index] = false;
    }
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

    const entryConfirmationRequests: Observable<any>[] = this.reportForm.value.entries.map((entry: any) =>
      this.reportService.confirmReportEntry(this.report.id, entry.id)
    );

    console.log('Entry confirmation requests:', entryConfirmationRequests);

    forkJoin(entryConfirmationRequests).subscribe({
      next: (results: any[]) => {
        console.log('Confirmation results:', results);

        const allConfirmed = results.every(result => result !== null);
        if (allConfirmed) {
          console.log('All entries confirmed, proceeding to confirm report.');
          this.reportService.confirmReport(this.report.id).subscribe({
            next: () => {
              this.toastr.info('Отчет успешно подтвержден');
              this.reportStateService.loadReports();
              this.router.navigate(['/reports']);
            },
            error: error => {
              this.toastr.error('Ошибка подтверждения отчета');
              console.error('Error confirming report:', error);
            }
          });
        } else {
          this.toastr.warning('Некоторые записи не были подтверждены');
          console.warn('Not all entries confirmed.');
        }
      },
      error: error => {
        console.error('Error in forkJoin:', error);
        this.toastr.error('Ошибка при выполнении запросов на подтверждение записей');
      }
    });
  }



  saveReport(): void {
    if (this.reportForm.invalid) {
      this.toastr.error('Форма заполнена неверно');
      return;
    }

    this.isCreating = true;

    const updatedReportEntries: CreateReportEntryDto[] = this.reportForm.value.entries
      .filter((entry: any) => this.entries.at(this.reportForm.value.entries.indexOf(entry)).dirty)
      .map((entry: any) => {
        const startTimeUTC = new Date(entry.startTime).toISOString();
        const endTimeUTC = new Date(entry.endTime).toISOString();

        return {
          id: entry.id,
          agentId: this.report.agentId,
          respondentId: this.report.respondentId,
          procedureId: entry.procedureName.id,
          startTime: startTimeUTC,
          endTime: endTimeUTC,
          comment: entry.comment,
          reportId: this.report.id
        }
      });
    console.log('Updated Report Entries:', updatedReportEntries);

    updatedReportEntries.forEach(entry => {
      if (entry.id) {
        this.reportService.updateReportEntry(this.report.id, entry.id, entry).subscribe({
          next: () => {
            this.toastr.info('Запись успешно обновлена'),
              this.resetFormState();
          },
          error: error => this.toastr.error('Ошибка обновления записи'),
          complete: () => this.isCreating = false
        });
      }
    });

    this.calculateTimeGaps();
    this.toastr.info('Отчет успешно сохранен');
  }

  resetFormState() {
    const entries = this.reportForm.get('entries') as FormArray;

    entries.controls.forEach(control => {
      control.markAsPristine();
      control.markAsUntouched();
    });

    this.reportForm.markAsPristine();
    this.reportForm.markAsUntouched();
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
    if (this.reportForm.dirty || this.reportForm.touched) {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '400px',
        data: { message: "У вас есть несохраненные изменения. Вы уверены, что хотите покинуть страницу?" }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.reportStateService.loadReports();
          this.router.navigate(['/reports']); // Или любой другой маршрут
        }
      });
    } else {
      this.router.navigate(['/reports']); // Или любой другой маршрут
    }
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
