using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.DTOs;
using server.Entities;

namespace server.Controllers
{
    [Authorize]
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
            var respondents = await _context.Respondents
            .OrderByDescending(r => r.RegistrationDate)
            .Select(r => new RespondentDto
            {
                Id = r.Id,
                Name = r.Name,
                RegistrationDate = r.RegistrationDate.ToString("yyyy-MM-ddTHH:mm:ss"),
                City = r.City,
                BranchId = r.BranchId
            })
            .ToListAsync();

            return Ok(respondents);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Respondent>> GetRespondent(int id)
        {
            var respondent = await _context.Respondents
         .FirstOrDefaultAsync(r => r.Id == id);

            if (respondent == null)
            {
                return NotFound();
            }

            // Преобразуем Respondent в RespondentDto
            var respondentDto = new RespondentDto
            {
                Id = respondent.Id,
                Name = respondent.Name,
                RegistrationDate = respondent.RegistrationDate.ToString("yyyy-MM-ddTHH:mm:ss"), // Преобразуем DateTime в строку
                City = respondent.City,
                BranchId = respondent.BranchId,
            };

            return Ok(respondentDto);
        }

        [HttpPost("createRespondent")]
        public async Task<ActionResult<RespondentDto>> CreateRespondent(CreateRespondentDto createDto)
        {
            if (await RespondentExists(createDto.Name))
                return BadRequest("Респондент уже существует");

            var respondent = new Respondent
            {
                Name = createDto.Name,
                RegistrationDate = DateTime.Parse(createDto.RegistrationDate),
                City = createDto.City,
                BranchId = createDto.BranchId,
            };

            _context.Respondents.Add(respondent);
            await _context.SaveChangesAsync();

            return new RespondentDto
            {
                Id = respondent.Id,
                Name = respondent.Name,
                RegistrationDate = respondent.RegistrationDate.ToString("yyyy-MM-ddTHH:mm:ss"),
                City = respondent.City,
                BranchId = respondent.BranchId
            };
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

        private async Task<bool> RespondentExists(string name)
        {
            return await _context.Respondents.AnyAsync(x => x.Name.ToLower() == name.ToLower());
        }
    }
}
