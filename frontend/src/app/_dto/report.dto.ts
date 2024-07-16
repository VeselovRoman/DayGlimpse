// create-report.dto.ts
export interface CreateReportDto {
  reportDate: string;
  agentId: number;  
  respondentId: number;
  isConfirmed?: boolean; // Добавлен флаг isConfirmed
  }
  
  // create-report-entry.dto.ts
  export interface CreateReportEntryDto {
    agentId: number;
    respondentId: number;
    procedureId: number;
    startTime: string;
    endTime: string;
    comment: string;
    reportId: number;
    isConfirmed?: boolean; // Добавлен флаг isConfirmed
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
  }
  
  // report-entry.dto.ts
  export interface ReportEntryDto {
    id: number;
    procedureId: number;
    procedureName: string;
    startTime: string;
    endTime: string;
    comment: string;
    agentId: number;
    agentName: string;
    respondentId: number;
    respondentName: string;
  }
  