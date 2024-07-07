// ProcedureService.cs

using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.DTOs;
using server.Entities;
using server.Interfaces;

namespace server.Services
{
    public class ProcedureService : IProcedureService
    {
        private readonly DataContext _context;

        public ProcedureService(DataContext context)
        {
            _context = context;
        }

        public async Task<List<ProcedureDto>> GetProceduresAsync()
        {
            var procedures = await _context.Procedures
                .Select(p => new ProcedureDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    StandardTime = p.StandardTime
                })
                .ToListAsync();

            return procedures;
        }
    }
}
