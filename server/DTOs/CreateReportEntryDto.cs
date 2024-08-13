namespace server.DTOs
{
    public class CreateReportEntryDto
    {
        public int AgentId { get; set; }
        public int RespondentId { get; set; }
        public int? ProcedureId { get; set; }
        public string StartTime { get; set; }
        public string EndTime { get; set; }
        public string Comment { get; set; }
        public int ReportId { get; set; }
        public bool isConfirmed { get; set; }
        public int? CategoryId { get; set; }
        public int Order { get; set; }
    }
}

