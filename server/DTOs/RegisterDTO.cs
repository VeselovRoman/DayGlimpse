using System.ComponentModel.DataAnnotations;

namespace server.DTOs;

public class RegisterDTO
{
    public string AgentName { get; set; }
    public string Password { get; set; }
    public int BranchId { get; set; }
    public string City { get; set; } // поле для города
}
