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

        [HttpPost]
        public async Task<ActionResult<ReportDto>> CreateReport(CreateReportDto createReportDto)
        {
            try
            {
                var nameIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
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

                // Используем agent.Id для сохранения в качестве AgentId в другой сущности
                var report = new Report
                {
                    ReportDate = DateTime.UtcNow,
                    AgentId = agent.Id,
                    RespondentId = createReportDto.RespondentId
                };

                _context.Reports.Add(report);
                await _context.SaveChangesAsync();

                return new ReportDto
                {
                    Id = report.Id,
                    ReportDate = report.ReportDate,
                    AgentId = agent.Id,
                    RespondentId = report.RespondentId,
                };

            }
            catch (Exception ex)
            {
                // Обработка ошибок
                return BadRequest("Failed to create report: " + ex.Message);
            }
        }

        [HttpPost("{reportId}/entries")]
        public async Task<ActionResult<ReportEntryDto>> CreateReportEntry(int reportId, CreateReportEntryDto createReportEntryDto)
        {
            try
            {
                var nameIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
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
                }

                var reportEntry = new ReportEntry
                {
                    ProcedureId = createReportEntryDto.ProcedureId,
                    StartTime = createReportEntryDto.StartTime,
                    EndTime = createReportEntryDto.EndTime,
                    Comment = createReportEntryDto.Comment,
                    ReportId = reportId,
                    AgentId = agent.Id,
                    RespondentId = report.RespondentId
                    //RespondentId = (await _context.Reports.FindAsync(reportId)).RespondentId
                };

                _context.ReportEntries.Add(reportEntry);
                await _context.SaveChangesAsync();

                return new ReportEntryDto
                {
                    Id = reportEntry.Id,
                    ProcedureId = reportEntry.ProcedureId,
                    StartTime = reportEntry.StartTime,
                    EndTime = reportEntry.EndTime,
                    Comment = reportEntry.Comment,
                    AgentId = reportEntry.AgentId,
                    RespondentId = reportEntry.RespondentId
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
                    RespondentName = reportEntry.Respondent?.Name // Возвращаем имя респондента
                };
            }
            catch (Exception ex)
            {
                return BadRequest("Failed to retrieve report entry: " + ex.Message);
            }
        }

    }
}
