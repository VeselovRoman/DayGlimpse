using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.DTOs;
using server.Entities;

namespace server.Controllers
{
    public class RespondentsController : BaseApiController
    {
        private readonly DataContext _context;

        public RespondentsController(DataContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Respondent>>> GetRespondents()
        {
            return await _context.Respondents.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Respondent>> GetRespondent(int id)
        {
            var respondent = await _context.Respondents.FindAsync(id);
            if (respondent == null)
            {
                return NotFound();
            }
            return respondent;
        }

        [HttpPost("createRespondent")]
        public async Task<ActionResult<Respondent>> CreateRespondent(CreateRespondentDto createDto)
        {
            var respondent = new Respondent
            {
                Name = createDto.Name,
                RegistrationDate = DateTime.UtcNow,
                City = createDto.City,
                BranchId = createDto.BranchId,
                // Здесь можете установить другие свойства Respondent по необходимости
            };

            _context.Respondents.Add(respondent);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetRespondent), new { id = respondent.Id }, respondent);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> UpdateRespondent(int id, [FromBody] RespondentUpdateDto updateDto)
        {
            var respondent = await _context.Respondents.FindAsync(id);

            if (respondent == null)
            {
                return NotFound();
            }

            // Обновляем только разрешенные поля
            respondent.Name = updateDto.Name;
            respondent.City = updateDto.City;
            respondent.BranchId = updateDto.BranchId;
            // Добавьте другие обновления по мере необходимости

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRespondent(int id)
        {
            var respondent = await _context.Respondents.FindAsync(id);
            if (respondent == null)
            {
                return NotFound();
            }

            _context.Respondents.Remove(respondent);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool RespondentExists(int id)
        {
            return _context.Respondents.Any(e => e.Id == id);
        }
    }
}
