namespace server.DTOs
{
    public class CreateReportEntryDto
    {
        public int ProcedureId { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public string Comment { get; set; }
        public int ReportId { get; set; }
    }
}
