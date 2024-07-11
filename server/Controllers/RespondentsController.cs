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
        public async Task<ActionResult<RespondentDto>> CreateRespondent(CreateRespondentDto createDto)
        {
            if (await RespondentExists(createDto.Name))
                return BadRequest("Респондент уже существует");

            var respondent = new Respondent
            {
                Name = createDto.Name,
                RegistrationDate = DateTime.UtcNow,
                City = createDto.City,
                BranchId = createDto.BranchId,
            };

            _context.Respondents.Add(respondent);
            await _context.SaveChangesAsync();

            return new RespondentDto
            {
                Id = respondent.Id,
                Name = respondent.Name,
                RegistrationDate = respondent.RegistrationDate,
                City = respondent.City,
                BranchId = respondent.BranchId
            };
        }

        private async Task<bool> RespondentExists(string name)
        {
            return await _context.Respondents.AnyAsync(x => x.Name.ToLower() == name.ToLower());
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
