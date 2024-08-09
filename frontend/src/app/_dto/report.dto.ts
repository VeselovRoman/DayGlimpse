// create-report.dto.ts
export interface CreateReportDto {
  reportDate: string;
  agentId: number;
  respondentId: number;
}

// create-report-entry.dto.ts
export interface CreateReportEntryDto {
  id: number,
  agentId: number;
  respondentId: number;
  procedureId?: number;
  startTime: string;
  endTime: string;
  comment: string;
  reportId: number;
  CategoryId: number;
}

// update-report-entry.dto.ts
export interface UpdateReportEntryDto {
  id: number,
  procedureId?: number;
  startTime: string;
  endTime: string;
  comment: string;
  CategoryId: number;
  order: number;
}

// report.dto.ts
export interface ReportDto {
  id: number;
  reportDate: string;
  agentId: number;
  agentName: string;
  respondentId: number;
  respondentName: string;
  reportEntries: ReportEntryDto[];
  isConfirmed: boolean;
}

// report-entry.dto.ts
export interface ReportEntryDto {
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
  isConfirmed: boolean;
  CategoryId: number;
  order: number
}
