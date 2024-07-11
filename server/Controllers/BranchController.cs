using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.DTOs;

namespace server.Controllers;

public class BranchesController(DataContext context) : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Branch>>> GetBranches()
    {
        var branches = await context.Branches.ToListAsync();

        return Ok(branches);

    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<Branch>> GetBranch(int id)
    {
        var branch = await context.Branches.FindAsync(id);

        if (branch == null) return NotFound("Филиал не найден");

        return branch;
    }

    [HttpPost("register")]
    public async Task<ActionResult<CreateBranchDto>> Register(CreateBranchDto branchDto)
    {
        if (await BranchExists(branchDto.Name)) return BadRequest("Филиал уже добавлен в справочник");

        var branch = new Branch
        {
            Name = branchDto.Name.ToLower()
        };

        context.Branches.Add(branch);
        await context.SaveChangesAsync();

        return new CreateBranchDto
        {
            Name = branch.Name
        };

    }

    [HttpPut("{id:int}")] // PUT: api/branches/{id}
    public async Task<IActionResult> UpdateBranch(int id, Branch branch)
    {
        if (id != branch.Id) return BadRequest("Идентификатор филиала не совпадает");

        context.Entry(branch).State = EntityState.Modified;

        try
        {
            await context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!await BranchExists(branch.Id))
            {
                return NotFound("Филиал не найден");
            }
            else
            {
                throw;
            }
        }

        return NoContent();
    }

    [HttpDelete("{id:int}")] // Новый метод для удаления филиала
    public async Task<IActionResult> DeleteBranch(int id)
    {
        var branch = await context.Branches.FindAsync(id);
        if (branch == null)
        {
            return NotFound("Филиал не найден");
        }

        context.Branches.Remove(branch);
        await context.SaveChangesAsync();

        return NoContent();
    }

    private async Task<bool> BranchExists(string branchname)
    {
        return await context.Branches.AnyAsync(x => x.Name.ToLower() == branchname.ToLower());
    }

    private async Task<bool> BranchExists(int id)
    {
        return await context.Branches.AnyAsync(x => x.Id == id);
    }
}
