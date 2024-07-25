namespace server.DTOs;

public class UpdateAgentDto
{
    public int Id { get; set; }
    public string Login { get; set; }
    public int BranchId { get; set; }
    public string City { get; set; }
}