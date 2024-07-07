using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Interfaces;
using server.Services;

namespace server.Extensions;

public static class ApplicationServiceExtentions
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services,
        IConfiguration config)
    {

        services.AddControllers();
        services.AddDbContext<DataContext>(opt =>
        {
            opt.UseNpgsql(config.GetConnectionString("DefaultConnection"));
        });
        services.AddCors();
        services.AddScoped<IProcedureService, ProcedureService>();
        services.AddScoped<ITokenService, TokenService>();

        return services;
    }
}