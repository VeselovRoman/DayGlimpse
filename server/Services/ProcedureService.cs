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
            return await _context.Procedures
                .Select(p => new ProcedureDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    StandardTime = p.StandardTime
                })
                .ToListAsync();
        }

        public async Task<ProcedureDto> GetProcedureByIdAsync(int id)
        {
            var procedure = await _context.Procedures.FindAsync(id);

            if (procedure == null) return null;

            return new ProcedureDto
            {
                Id = procedure.Id,
                Name = procedure.Name,
                StandardTime = procedure.StandardTime
            };
        }

        public async Task<ProcedureDto> CreateProcedureAsync(ProcedureDto procedureDto)
        {
            var procedure = new Procedure
            {
                Name = procedureDto.Name,
                StandardTime = procedureDto.StandardTime
            };

            _context.Procedures.Add(procedure);
            await _context.SaveChangesAsync();

            procedureDto.Id = procedure.Id;
            return procedureDto;
        }

        public async Task<bool> UpdateProcedureAsync(int id, ProcedureDto procedureDto)
        {
            var procedure = await _context.Procedures.FindAsync(id);

            if (procedure == null) return false;

            procedure.Name = procedureDto.Name;
            procedure.StandardTime = procedureDto.StandardTime;

            await _context.SaveChangesAsync();
            return true;
        }
    }
}
