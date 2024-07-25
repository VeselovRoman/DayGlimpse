using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Entities;


[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly ActiveDirectoryService _adService;
    private readonly DataContext _context;


    public AuthController(ActiveDirectoryService adService, DataContext context)
    {
        _adService = adService;
        _context = context;
    }

    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<IActionResult> Login([FromBody] LoginModel model)
    {
        if (_adService.AuthenticateUser(model.Username, model.Password, out var firstName, out var lastName))
        {
            var agent = await _context.Agents.SingleOrDefaultAsync(a => a.Login == model.Username);
            if (agent == null)
            {
                agent = new Agent
                {
                    Login = model.Username,
                    FirstName = firstName,
                    LastName = lastName,
                };
                _context.Agents.Add(agent);
                await _context.SaveChangesAsync();
            }
            
            var token = _adService.GenerateJwtToken(agent.Id, model.Username, firstName, lastName);
            return Ok(new
            {
                agentId = agent.Id,
                token,
                firstName,
                lastName
            });
        }
        return Unauthorized(new { message = "Неверный логин или пароль" });
    }
}

public class LoginModel
{
    public string Username { get; set; }
    public string Password { get; set; }
}
