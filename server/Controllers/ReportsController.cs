using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.DTOs;
using server.DTOs.server.DTOs;
using server.Entities;

namespace server.Controllers
{
    [Authorize]
    public class ReportsController : BaseApiController
    {
        private readonly DataContext _context;

        public ReportsController(DataContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ReportDto>>> GetReports()
        {
            var reports = await _context.Reports
                .Include(r => r.Agent)
                .Include(r => r.Respondent)
                .Include(r => r.ReportEntries)
                    .ThenInclude(re => re.Procedure)
                .Include(r => r.ReportEntries)
                .ThenInclude(re => re.Category)
                    .OrderByDescending(r => r.Id)
                .Select(report => new ReportDto
                {
                    Id = report.Id,
                    ReportDate = report.ReportDate.ToString("yyyy-MM-ddTHH:mm:ss"),
                    AgentId = report.AgentId,
                    AgentName = report.Agent.FirstName + " " + report.Agent.LastName,
                    RespondentId = report.RespondentId,
                    RespondentName = report.Respondent.Name,
                    isConfirmed = report.IsConfirmed,
                    ReportEntries = report.ReportEntries
                        .OrderBy(entry => entry.Order)
                        .ThenBy(re => re.Id)
                        .Select(entry => new ReportEntryDto
                        {
                            Id = entry.Id,
                            ProcedureId = entry.ProcedureId,
                            ProcedureName = entry.Procedure.Name,
                            StartTime = entry.StartTime,
                            EndTime = entry.EndTime,
                            Comment = entry.Comment,
                            AgentId = entry.AgentId,
                            AgentName = report.Agent.FirstName + " " + report.Agent.LastName,
                            RespondentId = entry.RespondentId,
                            RespondentName = entry.Respondent.Name,
                            isConfirmed = entry.IsConfirmed,
                            CategoryId = entry.CategoryId,
                            CategoryName = entry.Category.CostCategory,
                            Order = entry.Order
                        }).ToList()
                })
                .ToListAsync();

            return reports;
        }

        [HttpPost]
        public async Task<ActionResult<ReportDto>> CreateReport(CreateReportDto createReportDto)
        {
            try
            {
                var report = new Report
                {
                    ReportDate = DateTime.Parse(createReportDto.ReportDate),
                    AgentId = createReportDto.AgentId,
                    RespondentId = createReportDto.RespondentId,
                    IsConfirmed = false

                };

                _context.Reports.Add(report);
                await _context.SaveChangesAsync();

                return new ReportDto
                {
                    Id = report.Id,
                    ReportDate = report.ReportDate.ToString("yyyy-MM-ddTHH:mm:ss"),
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


        [HttpPost("{reportId}/entries")]
        public async Task<ActionResult<ReportEntryDto>> CreateReportEntry(int reportId, CreateReportEntryDto createReportEntryDto)
        {
            try
            {
                var reportEntry = new ReportEntry
                {
                    AgentId = createReportEntryDto.AgentId,
                    RespondentId = createReportEntryDto.RespondentId,
                    ProcedureId = createReportEntryDto.ProcedureId,
                    StartTime = createReportEntryDto.StartTime,
                    EndTime = createReportEntryDto.EndTime,
                    Comment = createReportEntryDto.Comment,
                    ReportId = reportId,
                    IsConfirmed = false,
                    CategoryId = createReportEntryDto.CategoryId
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
                    isConfirmed = reportEntry.IsConfirmed,
                    CategoryId = reportEntry.CategoryId
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
                        .ThenInclude(re => re.Procedure)
                    .Include(r => r.Agent)
                    .Include(r => r.Respondent)
                    .FirstOrDefaultAsync(r => r.Id == id);

                if (report == null) return NotFound();

                var agentName = report.Agent.FirstName;
                var respondentName = report.Respondent.Name;

                var reportDto = new ReportDto
                {
                    Id = report.Id,
                    ReportDate = report.ReportDate.ToString("yyyy-MM-ddTHH:mm:ss"),
                    AgentId = report.Agent?.Id ?? 0,
                    AgentName = agentName,
                    RespondentId = report.RespondentId,
                    RespondentName = respondentName,
                    isConfirmed = report.IsConfirmed,
                    ReportEntries = report.ReportEntries
                        .OrderBy(re => re.Order)
                        .ThenBy(re => re.Id)
                        .Select(re => new ReportEntryDto
                        {
                            Id = re.Id,
                            ProcedureId = re.ProcedureId,
                            ProcedureName = re.Procedure?.Name ?? "Неизвестная процедура",
                            StartTime = re.StartTime,
                            EndTime = re.EndTime,
                            Comment = re.Comment,
                            AgentId = re.AgentId,
                            RespondentId = re.RespondentId,
                            CategoryId = re.CategoryId,
                            Order = re.Order
                        }).ToList()
                };
                return Ok(reportDto);
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
                    AgentName = reportEntry.Agent?.FirstName, // Возвращаем имя агента
                    RespondentId = reportEntry.RespondentId,
                    RespondentName = reportEntry.Respondent?.Name, // Возвращаем имя респондента
                    isConfirmed = reportEntry.IsConfirmed,
                    CategoryId = reportEntry.CategoryId

                };
            }
            catch (Exception ex)
            {
                return BadRequest("Failed to retrieve report entry: " + ex.Message);
            }
        }

        // Подтверждение отчета
        [HttpPut("{reportId}/confirm")]
        public async Task<IActionResult> ConfirmReport(int reportId)
        {
            var report = await _context.Reports.FindAsync(reportId);

            if (report == null)
            {
                return NotFound(new { message = $"Report with id {reportId} not found." });
            }

            report.IsConfirmed = true;
            await _context.SaveChangesAsync();

            return Ok(new { message = $"Report with id {reportId} confirmed." });
        }

        // Подтверждение записи

        [HttpPut("{reportId}/entries/{entryId}/confirm")]
        public async Task<IActionResult> ConfirmReportEntry(int reportId, int entryId)
        {
            var entry = await _context.ReportEntries
                .Where(e => e.ReportId == reportId && e.Id == entryId)
                .FirstOrDefaultAsync();

            if (entry == null)
            {
                return NotFound(new { message = $"Entry with id {entryId} for report {reportId} not found." });
            }

            entry.IsConfirmed = true;
            await _context.SaveChangesAsync();

            return Ok(new { message = $"Entry {entryId} confirmed for report {reportId}." });
        }

        // Обновляет запись отчета
        [HttpPut("{reportId}/entries/{entryId}")]
        public async Task<ActionResult<ReportEntryDto>> UpdateReportEntry(int reportId, int entryId, UpdateReportEntryDto updateReportEntryDto)
        {
            try
            {
                var report = await _context.Reports
                    .Include(r => r.ReportEntries)
                    .FirstOrDefaultAsync(r => r.Id == reportId);

                if (report == null)
                {
                    return NotFound($"Report with id {reportId} not found.");
                }

                var entry = report.ReportEntries.FirstOrDefault(re => re.Id == entryId);

                if (entry == null)
                {
                    return NotFound($"Report entry with id {entryId} not found in report.");
                }

                // Update the entry with new data
                entry.ProcedureId = updateReportEntryDto.ProcedureId;
                entry.StartTime = DateTime.SpecifyKind(DateTime.Parse(updateReportEntryDto.StartTime), DateTimeKind.Unspecified);
                entry.EndTime = DateTime.SpecifyKind(DateTime.Parse(updateReportEntryDto.EndTime), DateTimeKind.Unspecified);
                entry.Comment = updateReportEntryDto.Comment;
                entry.CategoryId = updateReportEntryDto.CategoryId;
                entry.Order = updateReportEntryDto.Order;

                await _context.SaveChangesAsync();

                return new ReportEntryDto
                {
                    Id = entry.Id,
                    ProcedureId = entry.ProcedureId,
                    StartTime = entry.StartTime,
                    EndTime = entry.EndTime,
                    Comment = entry.Comment,
                    AgentId = entry.AgentId,
                    RespondentId = entry.RespondentId,
                    isConfirmed = entry.IsConfirmed,
                    CategoryId = entry.CategoryId
                };
            }
            catch (Exception ex)
            {
                return BadRequest($"Failed to update report entry: {ex.Message}");
            }
        }

        [HttpDelete("{reportId}/entries/{entryId}")]
        public async Task<IActionResult> DeleteReportEntry(int reportId, int entryId)
        {
            try
            {
                // Находим отчет по reportId и включаем в него записи
                var report = await _context.Reports
                    .Include(r => r.ReportEntries)
                    .FirstOrDefaultAsync(r => r.Id == reportId);

                if (report == null)
                {
                    return NotFound($"Report with id {reportId} not found.");
                }

                // Находим запись отчета по entryId
                var entry = report.ReportEntries.FirstOrDefault(re => re.Id == entryId);

                if (entry == null)
                {
                    return NotFound($"Report entry with id {entryId} not found in report.");
                }

                // Удаляем запись из базы данных и сохраняем изменения
                _context.ReportEntries.Remove(entry);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                // Обработка ошибок
                return BadRequest($"Failed to delete report entry: {ex.Message}");
            }
        }

    }

}
