using server.Extensions;
using server.Helpers;



var builder = WebApplication.CreateBuilder(args);

builder.Services.AddIdentityService(builder.Configuration);
builder.Services.AddApplicationServices(builder.Configuration);

// Настройка конфигурации базы данных
DatabaseConfig.ConfigureDatabase(builder.Configuration);
ActiveDirectoryConfig.ConfigureActiveDirectoryService(builder.Services, builder.Configuration); // Настройка службы Active Directory

builder.Services.AddControllers();

// Add CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy", policy =>
    {
        policy.AllowAnyHeader()
              .AllowAnyMethod()
              .AllowAnyOrigin(); // Разрешить любые источники 
              //.WithOrigins("http://localhost:4200", "https://localhost:4200", "http://158.160.134.124");
    });
});

builder.WebHost.ConfigureKestrel(KestrelConfiguration.ConfigureKestrel);

var app = builder.Build();

app.UseCors("CorsPolicy");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();