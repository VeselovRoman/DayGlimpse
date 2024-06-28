using System.ComponentModel.DataAnnotations;

namespace server.DTOs;

public class RegisterDTO
{
    [Required]
    public string Agentname { get; set; }

    [Required]
    public string Password { get; set; }
    public int BranchId { get; set; }
}
