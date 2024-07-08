// create-report.dto.ts
export interface CreateReportDto {
  reportDate: Date;
  agentId: number;  
  respondentId: number;
  isConfirmed?: boolean; // Добавлен флаг isConfirmed
  }
  
  // create-report-entry.dto.ts
  export interface CreateReportEntryDto {
    agentId: number;
    respondentId: number;
    procedureId: number;
    startTime: Date;
    endTime: Date;
    comment: string;
    reportId: number;
    isConfirmed?: boolean; // Добавлен флаг isConfirmed
  }
  
  // report.dto.ts
  export interface ReportDto {
    id: number;
    reportDate: Date;
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
    startTime: Date;
    endTime: Date;
    comment: string;
    agentId: number;
    agentName: string;
    respondentId: number;
    respondentName: string;
  }
  