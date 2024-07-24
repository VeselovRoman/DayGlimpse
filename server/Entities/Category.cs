using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace server.Entities
{
    public class Category
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        public string MainGroup { get; set; } // Основные группы

        [Required]
        public string CostGroup { get; set; } // Группа затрат рабочего времени

        [Required]
        public string CostCategory { get; set; } // Категория затрат рабочего времени

        [Required]
        public string CostIndex { get; set; } // Индекс элемента затрат рабочего времени

        [Required]
        public string CostName { get; set; } // Наименование затрат времени
    }
}
