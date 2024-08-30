using System.Collections.Generic;
using System.Threading.Tasks;
using server.DTOs;

namespace server.Interfaces
{
    public interface IProcedureService
    {
        Task<List<ProcedureDto>> GetProceduresAsync();
        Task<ProcedureDto> GetProcedureByIdAsync(int id);
        Task<ProcedureDto> CreateProcedureAsync(ProcedureDto procedureDto);
        Task<bool> UpdateProcedureAsync(int id, ProcedureDto procedureDto);
    }
}
