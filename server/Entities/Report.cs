namespace server.Entities
{
    public class Report
    {
        public int Id { get; set; }
        public DateTime ReportDate { get; set; } = DateTime.UtcNow;
        public int AgentId { get; set; }
        public Agent Agent { get; set; }
        public int RespondentId { get; set; }
        public Respondent Respondent { get; set; }
        public ICollection<ReportEntry> ReportEntries { get; set; } = new List<ReportEntry>();
    }
}
