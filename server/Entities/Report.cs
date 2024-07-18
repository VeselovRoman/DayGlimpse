using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace server.Entities
{
    public class Report
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public DateTime ReportDate { get; set; } = DateTime.UtcNow;
        
        public int AgentId { get; set; }
        public Agent Agent { get; set; }

        public int RespondentId { get; set; }
        public Respondent Respondent { get; set; }

        public bool IsConfirmed { get; set; } // Флаг подтверждения отчета
        public ICollection<ReportEntry> ReportEntries { get; set; } = new List<ReportEntry>();
    }
}
