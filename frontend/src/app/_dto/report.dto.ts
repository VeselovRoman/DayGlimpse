// create-report.dto.ts
export interface CreateReportDto {
    respondentId: number;
  }
  
  // create-report-entry.dto.ts
  export interface CreateReportEntryDto {
    procedureId: number;
    startTime: Date;
    endTime: Date;
    comment: string;
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
  