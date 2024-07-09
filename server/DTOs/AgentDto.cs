namespace server.DTOs;

public class AgentDto
{
    public int Id { get; set; }
    public string AgentName { get; set; }
    public string Token { get; set; }
    public int BranchId { get; set; }
    public string City { get; set; }
    public DateTime RegistrationDate { get; set; }
}