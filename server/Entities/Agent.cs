using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace server.Entities
{
    public class Agent
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public string AgentName { get; set; }
        public byte[] PasswordHash { get; set; }
        public byte[] PasswordSalt { get; set; }
        public DateTime RegistrationDate { get; set; } = DateTime.UtcNow;
        public string City { get; set; }
        public int BranchId { get; set; }
        public Branch Branch { get; set; }
        public string Role { get; set; }
        public ICollection<Report> Reports { get; set; } = new List<Report>();
        public ICollection<ReportEntry> ReportEntries { get; set; } = new List<ReportEntry>();
    }
}
