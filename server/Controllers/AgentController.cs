using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.DTOs;
using server.Entities;
using server.Interfaces;

namespace server.Controllers;

public class AgentController(DataContext context, ITokenService tokenService) : BaseApiController
{
    [HttpPost("register")] //POST: api/agent/register?Agentname=dave&password=pwd
    public async Task<ActionResult<AgentDto>> Register(RegisterDTO registerDTO)
    {
        if (await AgentExists(registerDTO.Agentname)) return BadRequest("Имя пользователя уже занято");

        var hmac = new HMACSHA512();

        var agent = new Agent
        {
            AgentName = registerDTO.Agentname.ToLower(),
            PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDTO.Password)),
            PasswordSalt = hmac.Key,
            RegistrationDate = DateTime.UtcNow, // Устанавливаем текущую дату и время
            BranchId = registerDTO.BranchId // Устанавливаем BranchId 
        };

        context.Agents.Add(agent);
        await context.SaveChangesAsync();

        return new AgentDto
        {
            Agentname = agent.AgentName,
            Token = tokenService.CreateToken(agent),
            BranchId = agent.BranchId
        };

    }

    [HttpPost("login")]
    public async Task<ActionResult<AgentDto>> Login(LoginDto loginDto)
    {
        var agent = await context.Agents.FirstOrDefaultAsync(x => x.AgentName == loginDto.agentname.ToLower());

        if (agent == null) return Unauthorized("Неверное имя пользователя");

        using var hmac = new HMACSHA512(agent.PasswordSalt);

        var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDto.Password));

        for (int i = 0; i < computedHash.Length; i++)
        {
            if (computedHash[i] != agent.PasswordHash[i]) return Unauthorized("Неверный пароль");
        }

        return new AgentDto
        {
            Agentname = agent.AgentName,
            Token = tokenService.CreateToken(agent),
            BranchId = agent.BranchId
        };
    }
    private async Task<bool> AgentExists(string agentname)
    {
        return await context.Agents.AnyAsync(x => x.AgentName.ToLower() == agentname.ToLower()); // Bob != bob
    }
}
