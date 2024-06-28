using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Entities;

namespace server.Controllers;

public class UsersController(DataContext context) : BaseApiController
{
    [AllowAnonymous]
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Agent>>> GetUsers()
    {
        var agents = await context.Agents.ToListAsync();

        return agents;
    }

    [Authorize]
    [HttpGet("{id:int}")]
    public async Task<ActionResult<Agent>> GetUser(int id)
    {
        var agent = await context.Agents.FindAsync(id);

        if (agent == null) return NotFound();

        return agent;
    }
}
