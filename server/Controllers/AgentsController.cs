using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.DTOs;
using server.Entities;

namespace server.Controllers;

[Authorize]
public class AgentsController : BaseApiController
{
    private readonly DataContext _context;
    private readonly ILogger<AgentsController> _logger;

    public AgentsController(DataContext context, ILogger<AgentsController> logger)
    {
        _context = context;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<AgentDto>>> GetAgents()
    {
        var agents = await _context.Agents
        .OrderBy(b => b.Id)
            .Include(r => r.Branch) // Включаем данные о филиале
            .OrderBy(a => a.Id)
            .ToListAsync();

            var agentDtos = agents.Select(a => new AgentDto
            {
                Id = a.Id,
                Login = a.Login,
                FirstName = a.FirstName,
                LastName = a.LastName,
                City = a.City,
                BranchId = a.BranchId,
                BranchName = a.Branch != null ? a.Branch.Name : null,
                RegistrationDate = a.RegistrationDate.ToString("yyyy-MM-ddTHH:mm:ss")
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

    [HttpPut("{id:int}")] // PUT: api/agents/{id}
    public async Task<IActionResult> UpdateAgent(int id, UpdateAgentDto agentDto)
    {
        if (id != agentDto.Id)
            return BadRequest("Id does not match");

        var agent = await _context.Agents.FindAsync(id);

        if (agent == null)
            return NotFound();

        agent.City = agentDto.City;
        agent.BranchId = agentDto.BranchId;


        try
        {
            await _context.SaveChangesAsync();
            return NoContent();
        }
        catch (DbUpdateConcurrencyException)
        {
            throw;
        }
    }

    [HttpGet("{username}")]
    public async Task<ActionResult<Agent>> GetAgentByUsername(string username)
    {
        var agent = await _context.Agents.SingleOrDefaultAsync(a => a.Login == username);

        if (agent == null) return NotFound();

        return agent;
    }

    private async Task<bool> AgentExists(string agentname)
    {
        return await _context.Agents.AnyAsync(x => x.Login.ToLower() == agentname.ToLower());
    }
}
