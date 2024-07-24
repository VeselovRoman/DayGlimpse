namespace server.DTOs
{
    namespace server.DTOs
    {
        public class ReportEntryDto
        {
            public int Id { get; set; }
            public int ProcedureId { get; set; }
            public string ProcedureName { get; set; } // Добавляем имя процедуры
            public DateTime StartTime { get; set; }
            public DateTime EndTime { get; set; }
            public string Comment { get; set; }
            public int AgentId { get; set; }
            public string AgentName { get; set; } // Добавляем имя агента
            public int RespondentId { get; set; }
            public string RespondentName { get; set; } // Добавляем имя респондента
            public int ReportId { get; set; }
            public bool isConfirmed { get; set; }
            public int? CategoryId { get; set; }

        }
    }
}
