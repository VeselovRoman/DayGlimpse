using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using server.DTOs;
using server.Interfaces;

namespace server.Controllers
{
    [Authorize]
    public class ProceduresController : BaseApiController
    {
        private readonly IProcedureService _procedureService;

        public ProceduresController(IProcedureService procedureService)
        {
            _procedureService = procedureService;
        }

        [HttpGet]
        public async Task<ActionResult<List<ProcedureDto>>> GetProcedures()
        {
            var procedures = await _procedureService.GetProceduresAsync();
            return Ok(procedures);
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<ProcedureDto>> GetProcedure(int id)
        {
            var procedure = await _procedureService.GetProcedureByIdAsync(id);
            if (procedure == null)
                return NotFound("Процедура не найдена");

            return Ok(procedure);
        }

        [HttpPost]
        public async Task<ActionResult<ProcedureDto>> CreateProcedure(ProcedureDto procedureDto)
        {
            if (procedureDto == null)
                return BadRequest("Данные процедуры не могут быть пустыми");

            var createdProcedure = await _procedureService.CreateProcedureAsync(procedureDto);
            return CreatedAtAction(nameof(GetProcedure), new { id = createdProcedure.Id }, createdProcedure);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> UpdateProcedure(int id, ProcedureDto procedureDto)
        {
            if (id != procedureDto.Id)
                return BadRequest("ID процедуры не совпадает");

            var updated = await _procedureService.UpdateProcedureAsync(id, procedureDto);
            if (!updated)
                return NotFound("Процедура не найдена");

            return NoContent();
        }

    }
}
