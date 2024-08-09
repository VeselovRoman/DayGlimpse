export interface Report {
  id: number;
  reportDate: Date;
  agentId: number;
  agentName: string;
  respondentId: number;
  respondentName: string;
  reportEntries: Entry[];  // Добавляем свойство для записей отчета
  isConfirmed: boolean;
  index?: number; 
}

export interface Entry {
  id: number;
  procedureId?: number;
  procedureName: string;
  startTime: Date;
  endTime: Date;
  comment: string;
  agentId: number;
  agentName: string;
  respondentId: number;
  respondentName: string;
  reportId: number;
  isConfirmed: boolean;
  categoryId?: number;
  categoryName: string;
}