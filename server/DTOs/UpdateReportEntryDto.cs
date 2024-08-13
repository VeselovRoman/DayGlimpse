namespace server.DTOs
{
    public class UpdateReportEntryDto
    {
        public int ProcedureId { get; set; }
        public string StartTime { get; set; }
        public string EndTime { get; set; }
        public string Comment { get; set; }
        public int? CategoryId { get; set; }
        public int Order { get; set; }

    }
}

