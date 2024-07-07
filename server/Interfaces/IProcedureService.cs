// IProcedureService.cs

using System.Collections.Generic;
using System.Threading.Tasks;
using server.DTOs;

namespace server.Interfaces
{
    public interface IProcedureService
    {
        Task<List<ProcedureDto>> GetProceduresAsync();
    }
}
