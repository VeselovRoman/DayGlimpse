namespace server.DTOs
{
    namespace server.DTOs
    {
        public class ReportEntryDto
        {
            public int Id { get; set; }
            public int? ProcedureId { get; set; }
            public string ProcedureName { get; set; }
            public string StartTime { get; set; }
            public string EndTime { get; set; }
            public string Comment { get; set; }
            public int AgentId { get; set; }
            public string AgentName { get; set; }
            public int RespondentId { get; set; }
            public string RespondentName { get; set; }
            public int ReportId { get; set; }
            public bool isConfirmed { get; set; }
            public int? CategoryId { get; set; }
            public string CategoryName { get; set; }
            public int Order { get; set; }
        }
    }
}
