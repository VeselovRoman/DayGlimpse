using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.DTOs;
using server.Entities;
using server.Interfaces;

namespace server.Controllers;

[Authorize]
public class AgentsController : BaseApiController
{
    private readonly DataContext _context;
    private readonly ITokenService _tokenService;
    private readonly ILogger<AgentsController> _logger;

    public AgentsController(DataContext context, ITokenService tokenService, ILogger<AgentsController> logger)
    {
        _context = context;
        _tokenService = tokenService ;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<AgentDto>>> GetAgents()
    {
        var agents = await _context.Agents
            .Include(r => r.Branch) // Включаем данные о филиале
            .ToListAsync();

            var agentDtos = agents.Select(a => new AgentDto
            {
                Id = a.Id,
                AgentName = a.AgentName,
                City = a.City,
                BranchId = a.BranchId,
                BranchName = a.Branch.Name,
                RegistrationDate = a.RegistrationDate
            }).ToList();
            
        return agentDtos;
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<Agent>> GetAgent(int id)
    {
        var agent = await _context.Agents.FindAsync(id);

        if (agent == null) return NotFound();

        return agent;
    }

    [AllowAnonymous]
    [HttpPost("register")] //POST: api/agent/register?Agentname=dave&password=pwd
    public async Task<ActionResult<AgentDto>> Register(RegisterDTO registerDTO)
    {
        //if (await AgentExists(registerDTO.AgentName)) return BadRequest("Имя пользователя уже занято");

        var hmac = new HMACSHA512();

        var agent = new Agent
        {
            AgentName = registerDTO.AgentName.ToLower(),
            PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDTO.Password)),
            PasswordSalt = hmac.Key,
            RegistrationDate = DateTime.UtcNow, // Устанавливаем текущую дату и время
            BranchId = registerDTO.BranchId, // Устанавливаем BranchId 
            City = registerDTO.City // Сохраняем город
        };

        _context.Agents.Add(agent);
        await _context.SaveChangesAsync();

        return new AgentDto
        {
            AgentName = agent.AgentName,
            Token = _tokenService.CreateToken(agent),
            BranchId = agent.BranchId
        };

    }

    [AllowAnonymous]
    [HttpPost("login")]
    public async Task<ActionResult<AgentDto>> Login(LoginDto loginDto)
    {
        // Логируем полученные данные
        _logger.LogInformation($"Attempting login with username: {loginDto.AgentName}");

        var agents = await _context.Agents.ToListAsync();

        if (agents == null)
        {
            _logger.LogError("Agents list is null");
            return StatusCode(500, "Internal server error");
        }

        _logger.LogInformation($"Total agents in database: {agents.Count}");

        foreach (var x in agents)
        {
            _logger.LogInformation($"Agent: {x.AgentName}");
        }

        var normalizedUsername = loginDto.AgentName.ToLower();
        var agent = await _context.Agents.FirstOrDefaultAsync(x => x.AgentName == normalizedUsername);

        if (agent == null)
        {
            _logger.LogWarning($"User '{loginDto.AgentName}' not found");
            return Unauthorized("Неверное имя пользователя");
        }

        // Вывод данных агента для отладки
        _logger.LogInformation($"Agent found: {agent.AgentName}, PasswordHash: {agent.PasswordHash?.Length}, PasswordSalt: {agent.PasswordSalt?.Length}");

        if (agent.PasswordHash == null || agent.PasswordSalt == null)
        {
            _logger.LogWarning("PasswordHash or PasswordSalt is null");
            return Unauthorized("Проблемы с учетной записью");
        }

        try
        {

            using var hmac = new HMACSHA512(agent.PasswordSalt);

            var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDto.Password));

            for (int i = 0; i < computedHash.Length; i++)
            {
                if (computedHash[i] != agent.PasswordHash[i])
                {
                    _logger.LogWarning("Invalid password");
                    return Unauthorized("Неверный пароль");
                }
            }
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error during password validation: {ex.Message}");
            return Unauthorized("Ошибка при проверке пароля");
        }

        _logger.LogInformation("Login successful");

        return new AgentDto
        {
            Id = agent.Id,
            AgentName = agent.AgentName,
            Token = _tokenService.CreateToken(agent),
            BranchId = agent.BranchId,
            RegistrationDate = agent.RegistrationDate
        };
    }

    [HttpPut("{id:int}")] // PUT: api/agents/{id}
    public async Task<IActionResult> UpdateAgent(int id, UpdateAgentDto agentDto)
    {
        if (id != agentDto.Id)
            return BadRequest("Id does not match");

        var agent = await _context.Agents.FindAsync(id);

        if (agent == null)
            return NotFound();

        agent.AgentName = agentDto.AgentName;
        agent.City = agentDto.City; // Обновляем данные
        agent.BranchId = agentDto.BranchId; // Обновляем BranchId

        // Проверка существования агента асинхронно
        //var agentExists = await AgentExists(agentDto.AgentName);
        //if (!agentExists)
        //    return NotFound();

        try
        {
            await _context.SaveChangesAsync();
            return NoContent();
        }
        catch (DbUpdateConcurrencyException)
        {
            // При необходимости обработать исключение DbUpdateConcurrencyException
            throw;
        }
    }

    private async Task<bool> AgentExists(string agentname)
    {
        return await _context.Agents.AnyAsync(x => x.AgentName.ToLower() == agentname.ToLower()); // Bob != bob
    }
}
