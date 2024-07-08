using server.DTOs.server.DTOs;

namespace server.DTOs
{
    public class ReportDto
    {
        public int Id { get; set; }
        public DateTime ReportDate { get; set; }
        public int AgentId { get; set; }
        public string AgentName { get; set; } // Добавлено поле для имени агента
        public int RespondentId { get; set; }
        public string RespondentName { get; set; } // Добавлено поле для имени респондента
        public bool isConfirmed  { get; set; }// Добавлен флаг isConfirmed
        public List<ReportEntryDto> ReportEntries { get; set; } // Добавлено поле для записей отчета
    }
}

