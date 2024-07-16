namespace server.DTOs
{
    public class UpdateReportEntryDto
    {
        public int ProcedureId { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public string Comment { get; set; }
        
    }
}

