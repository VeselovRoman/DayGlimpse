// report.model.ts
export interface Report {
    id: number;
    reportNumber: number;
    reportDate: Date;
    agentId: number;
    agentName: string;
    entries: ReportEntry[];
  }
  
  export interface ReportEntry {
    id: number;
    procedureName: string;
    startTime: Date;
    endTime: Date;
    comment?: string;
  }