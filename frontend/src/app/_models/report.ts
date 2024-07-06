export interface ReportEntry {
  id: number;
  procedureId: number;
  procedureName: string;
  startTime: Date;
  endTime: Date;
  comment: string;
  agentId: number;
  agentName: string;
  respondentId: number;
  respondentName: string;
}

export interface Report {
  id: number;
  reportDate: Date;
  agentId: number;
  agentName: string;
  respondentId: number;
  respondentName: string;
  reportEntries: ReportEntry[];  // Добавляем свойство для записей отчета
}
