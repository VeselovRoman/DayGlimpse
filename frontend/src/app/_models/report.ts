export interface Report {
  id: number;
  reportDate: string;
  agentId: number;
  agentName: string;
  respondentId: number;
  respondentName: string;
  reportEntries: Entry[];
  isConfirmed: boolean;
  index?: number; 
}

export interface Entry {
  id: number;
  procedureId?: number;
  procedureName: string;
  startTime: string;
  endTime: string;
  comment: string;
  agentId: number;
  agentName: string;
  respondentId: number;
  respondentName: string;
  reportId: number;
  isConfirmed: boolean;
  categoryId?: number;
  categoryName: string;
  order: number;
}