namespace server.DTOs
{
    public class CreateReportDto
    {
        public int AgentId { get; set; }
        public int RespondentId { get; set; }
        public DateTime ReportDate { get; set; }
        public bool isConfirmed { get; set; }
    }
}