using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using server.Data;
using server.DTOs;
using server.DTOs.server.DTOs;
using server.Entities;
using server.Interfaces;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace server.Controllers
{
    [Authorize]
    public class ReportsController : BaseApiController
    {
        private readonly DataContext _context;
        private readonly ITokenService _tokenService;

        public ReportsController(DataContext context, ITokenService tokenService)
        {
            _context = context;
            _tokenService = tokenService;
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ReportDto>>> GetReports()
        {
            var reports = await _context.Reports
                .Include(r => r.Agent) // Включаем данные об агенте
                .Include(r => r.Respondent) // Включаем данные о респонденте
                .Include(r => r.ReportEntries) // Включаем данные о записях отчета
                    .ThenInclude(re => re.Procedure) // Включаем данные о процедуре
                .Select(report => new ReportDto
                {
                    Id = report.Id,
                    ReportDate = report.ReportDate,
                    AgentId = report.AgentId,
                    AgentName = report.Agent.AgentName, // Включаем имя агента
                    RespondentId = report.RespondentId,
                    RespondentName = report.Respondent.Name, // Включаем имя респондента
                    isConfirmed = report.IsConfirmed,
                    ReportEntries = report.ReportEntries.Select(entry => new ReportEntryDto
                    {
                        Id = entry.Id,
                        ProcedureId = entry.ProcedureId,
                        ProcedureName = entry.Procedure.Name,
                        StartTime = entry.StartTime,
                        EndTime = entry.EndTime,
                        Comment = entry.Comment,
                        AgentId = entry.AgentId,
                        AgentName = entry.Agent.AgentName,
                        RespondentId = entry.RespondentId,
                        RespondentName = entry.Respondent.Name,
                        isConfirmed = entry.IsConfirmed
                    }).ToList()
                })
                .ToListAsync();

            return reports;
        }
        [AllowAnonymous]
        [HttpPost]
        public async Task<ActionResult<ReportDto>> CreateReport(CreateReportDto createReportDto)
        {
            try
            {
                /*var nameIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (nameIdClaim == null)
                {
                    // Обработка случая, когда поле nameid отсутствует в токене
                    return Unauthorized("Claim 'nameid' not found in the user token.");
                }

                // Ищем агента по имени пользователя в базе данных
                var agent = await _context.Agents.SingleOrDefaultAsync(a => a.AgentName == nameIdClaim);

                if (agent == null)
                {
                    // Обработка случая, когда агент не найден
                    return NotFound("Agent not found.");
                }*/

                // Используем agent.Id для сохранения в качестве AgentId в другой сущности
                var report = new Report
                {
                    ReportDate = DateTime.UtcNow,
                    AgentId = createReportDto.AgentId,
                    RespondentId = createReportDto.RespondentId,
                    IsConfirmed = false

                };

                _context.Reports.Add(report);
                await _context.SaveChangesAsync();

                return new ReportDto
                {
                    Id = report.Id,
                    ReportDate = report.ReportDate,
                    AgentId = report.AgentId,
                    RespondentId = report.RespondentId,
                    isConfirmed = report.IsConfirmed
                };

            }
            catch (Exception ex)
            {
                // Обработка ошибок
                return BadRequest("Failed to create report: " + ex.Message);
            }
        }

        [AllowAnonymous]
        [HttpPost("{reportId}/entries")]
        public async Task<ActionResult<ReportEntryDto>> CreateReportEntry(int reportId, CreateReportEntryDto createReportEntryDto)
        {
            try
            {
                /*var nameIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (nameIdClaim == null)
                {
                    // Обработка случая, когда поле nameid отсутствует в токене
                    return Unauthorized("Claim 'nameid' not found in the user token.");
                }

                // Ищем агента по имени пользователя в базе данных
                var agent = await _context.Agents.SingleOrDefaultAsync(a => a.AgentName == nameIdClaim);

                if (agent == null)
                {
                    // Обработка случая, когда агент не найден
                    return NotFound("Agent not found.");
                }

                // Ищем отчет вместе с респондентом
                var report = await _context.Reports.Include(r => r.Respondent).FirstOrDefaultAsync(r => r.Id == reportId);

                if (report == null)
                {
                    // Обработка случая, когда отчет не найден
                    return NotFound("Report not found.");
                }*/

                var reportEntry = new ReportEntry
                {
                    AgentId = createReportEntryDto.AgentId,
                    RespondentId = createReportEntryDto.RespondentId,
                    ProcedureId = createReportEntryDto.ProcedureId,
                    StartTime = DateTime.SpecifyKind(createReportEntryDto.StartTime, DateTimeKind.Utc),
                    EndTime = DateTime.SpecifyKind(createReportEntryDto.EndTime, DateTimeKind.Utc),
                    Comment = createReportEntryDto.Comment,
                    ReportId = reportId,
                    IsConfirmed = false
                };

                _context.ReportEntries.Add(reportEntry);
                await _context.SaveChangesAsync();

                return new ReportEntryDto
                {
                    Id = reportEntry.Id,
                    AgentId = reportEntry.AgentId,
                    RespondentId = reportEntry.RespondentId,
                    ProcedureId = reportEntry.ProcedureId,
                    StartTime = reportEntry.StartTime,
                    EndTime = reportEntry.EndTime,
                    Comment = reportEntry.Comment,
                    ReportId = reportEntry.ReportId,
                    isConfirmed = reportEntry.IsConfirmed
                };
            }
            catch (Exception ex)
            {
                // Обработка ошибок
                return BadRequest("Failed to create report entry: " + ex.Message);
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ReportDto>> GetReport(int id)
        {
            try
            {
                var report = await _context.Reports
                    .Include(r => r.ReportEntries)
                        .ThenInclude(re => re.Procedure) // Включаем данные о процедуре
                    .Include(r => r.Agent)
                    .Include(r => r.Respondent) // Включаем данные о респонденте
                    .FirstOrDefaultAsync(r => r.Id == id);

                if (report == null) return NotFound();

                var agentName = report.Agent.AgentName;
                var respondentName = report.Respondent.Name;

                return new ReportDto
                {
                    Id = report.Id,
                    ReportDate = report.ReportDate,
                    AgentId = report.Agent.Id,
                    AgentName = agentName, // Возвращаем имя агента
                    RespondentId = report.RespondentId,
                    RespondentName = respondentName, // Возвращаем имя респондента
                    isConfirmed = report.IsConfirmed,
                    ReportEntries = report.ReportEntries.Select(re => new ReportEntryDto

                    {
                        Id = re.Id,
                        ProcedureId = re.ProcedureId,
                        ProcedureName = re.Procedure.Name, // Возвращаем имя процедуры
                        StartTime = re.StartTime,
                        EndTime = re.EndTime,
                        Comment = re.Comment,
                        AgentId = re.AgentId,
                        RespondentId = re.RespondentId
                    }).ToList()
                };
            }
            catch (Exception ex)
            {
                return BadRequest("Failed to retrieve report: " + ex.Message);
            }
        }

        [HttpGet("entries/{entryId}")]
        public async Task<ActionResult<ReportEntryDto>> GetReportEntry(int entryId)
        {
            try
            {
                var reportEntry = await _context.ReportEntries
                    .Include(re => re.Procedure) // Включаем данные о процедуре
                    .Include(re => re.Agent) // Включаем данные о агенте
                    .Include(re => re.Respondent) // Включаем данные о респонденте
                    .FirstOrDefaultAsync(re => re.Id == entryId);

                if (reportEntry == null)
                {
                    return NotFound();
                }

                return new ReportEntryDto
                {
                    Id = reportEntry.Id,
                    ProcedureId = reportEntry.ProcedureId,
                    ProcedureName = reportEntry.Procedure?.Name, // Возвращаем имя процедуры
                    StartTime = reportEntry.StartTime,
                    EndTime = reportEntry.EndTime,
                    Comment = reportEntry.Comment,
                    AgentId = reportEntry.AgentId,
                    AgentName = reportEntry.Agent?.AgentName, // Возвращаем имя агента
                    RespondentId = reportEntry.RespondentId,
                    RespondentName = reportEntry.Respondent?.Name, // Возвращаем имя респондента
                    isConfirmed = reportEntry.IsConfirmed
                };
            }
            catch (Exception ex)
            {
                return BadRequest("Failed to retrieve report entry: " + ex.Message);
            }
        }

        // Подтверждение отчета
        [AllowAnonymous]
        [HttpPut("{reportId}/confirm")]
        public async Task<IActionResult> ConfirmReport(int reportId)
        {
            var report = await _context.Reports.FindAsync(reportId);

            if (report == null)
            {
                return NotFound($"Report with id {reportId} not found.");
            }

            report.IsConfirmed = true;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // Подтверждение записи
        [AllowAnonymous]
        [HttpPut("{reportId}/entries/{entryId}/confirm")]
        public async Task<IActionResult> ConfirmReportEntry(int entryId)
        {
            var entry = await _context.ReportEntries.FindAsync(entryId);

            if (entry == null)
            {
                return NotFound($"Report entry with id {entryId} not found.");
            }

            entry.IsConfirmed = true;

            await _context.SaveChangesAsync();

            return NoContent();
        }

    }

}
