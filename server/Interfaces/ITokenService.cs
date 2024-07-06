using server.Entities;

namespace server.Interfaces;

public interface ITokenService
{
    string CreateToken(Agent agent);
}
