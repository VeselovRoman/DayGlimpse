using server.Entities;

public class Branch
{
    public int Id { get; set; }
    public string Name { get; set; }

    public ICollection<Agent> Agents { get; set; }
    public ICollection<Respondent> Respondents { get; set; }
}