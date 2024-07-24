using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Entities;

namespace server.Controllers;

[Authorize]
public class CategoriesController : BaseApiController
{
    private readonly DataContext _context;

    public CategoriesController(DataContext context)
    {
        _context = context;
    }

    // Получение всех категорий
    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<IEnumerable<Category>>> GetCategories()
    {
        var categories = await _context.Categories.ToListAsync();
        return Ok(categories);
    }

    // Получение конкретной категории по ID
    [HttpGet("{id:int}")]
    [AllowAnonymous]
    public async Task<ActionResult<Category>> GetCategory(int id)
    {
        var category = await _context.Categories.FindAsync(id);
        if (category == null) return NotFound("Категория не найдена");

        return category;
    }

    // Создание новой категории
    [HttpPost]
    public async Task<ActionResult<Category>> CreateCategory(Category category)
    {
        _context.Categories.Add(category);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetCategory), new { id = category.Id }, category);
    }

    // Обновление категории
    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateCategory(int id, Category category)
    {
        if (id != category.Id) return BadRequest("ID категории не совпадает");

        _context.Entry(category).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!await CategoryExists(id))
            {
                return NotFound("Категория не найдена");
            }
            else
            {
                throw;
            }
        }

        return NoContent();
    }

    // Удаление категории
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteCategory(int id)
    {
        var category = await _context.Categories.FindAsync(id);
        if (category == null)
        {
            return NotFound("Категория не найдена");
        }

        _context.Categories.Remove(category);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private async Task<bool> CategoryExists(int id)
    {
        return await _context.Categories.AnyAsync(x => x.Id == id);
    }
}
