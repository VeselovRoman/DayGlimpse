namespace server.DTOs;

public class ReportDto
{
    public int Id { get; set; }
    public int ActionID { get; set; }
    public int AgentId { get; set; }
    public int RespondentId { get; set; }
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
    public string Commment { get; set; }
    public TimeSpan Duration => EndTime - StartTime;
}
