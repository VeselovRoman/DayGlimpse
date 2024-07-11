using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using server.Entities;

public class Branch
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }
    public string Name { get; set; }
    public ICollection<Agent> Agents { get; set; } = new List<Agent>();

    public ICollection<Respondent> Respondents { get; set; } = new List<Respondent>();
}