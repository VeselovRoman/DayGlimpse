using server.DTOs.server.DTOs;

namespace server.DTOs
{
    public class ReportDto
    {
        public int Id { get; set; }
        public string ReportDate { get; set; }
        public int AgentId { get; set; }
        public string AgentName { get; set; }
        public int RespondentId { get; set; }
        public string RespondentName { get; set; }
        public bool isConfirmed  { get; set; }
        public List<ReportEntryDto> ReportEntries { get; set; }
    }
}

