namespace server.DTOs;

public class AgentDto
{
    public required string Agentname { get; set; }
    public required string Token { get; set; }
    public required int BranchId { get; set; }
}