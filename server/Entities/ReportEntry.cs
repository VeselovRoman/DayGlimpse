using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace server.Entities
{
    public class ReportEntry
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public string Comment { get; set; }
        public bool IsConfirmed { get; set; }  // Флаг подтверждения записи
        public int Order { get; set; } // Поле для хранения порядка

        // Foreign keys
        public int ReportId { get; set; }
        public int AgentId { get; set; }
        public int RespondentId { get; set; }
        public int? ProcedureId { get; set; } // Foreign key to Procedure
        public int? CategoryId { get; set; } // Сделали ключ nullable
        
        // Navigation properties
        public Report Report { get; set; } // Navigation property to Report
        public Agent Agent { get; set; } // Navigation property to Agent
        public Respondent Respondent { get; set; } // Navigation property to Respondent
        public Procedure Procedure { get; set; } // Navigation property to Procedure
        public Category Category { get; set; } // Навигационное свойство к Category

    }
}
