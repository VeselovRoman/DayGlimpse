namespace server.DTOs;

public class AgentDto
{
    public int Id { get; set; }
    public string Login { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public int? BranchId { get; set; }
    public string BranchName { get; set; }
    public string City { get; set; }
    public string RegistrationDate { get; set; }
}