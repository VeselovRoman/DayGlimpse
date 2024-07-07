// ProceduresController.cs

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.DTOs;
using server.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace server.Controllers
{
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
    }
}