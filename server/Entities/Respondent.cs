namespace server.Entities
{
    public class Respondent
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public DateTime RegistrationDate { get; set; }
        public string City { get; set; }
        public int BranchId { get; set; }
        public Branch Branch { get; set; }
        public string Role { get; set; }
        public ICollection<Report> Reports { get; set; } = new List<Report>();
        public ICollection<ReportEntry> ReportEntries { get; set; } = new List<ReportEntry>();
    }
}
