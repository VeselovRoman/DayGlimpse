using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using server.Data;
using server.Extensions;
using server.Helpers;

AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);

var builder = WebApplication.CreateBuilder(args);

// Получаем конфигурацию
var config = builder.Configuration;

// Переменные из конфигурации
var host = config["DatabaseSettings:Host"];
var port = config["DatabaseSettings:Port"];
var db = config["DatabaseSettings:Database"];
var username = config["DatabaseSettings:Username"];
var password = config["DatabaseSettings:Password"];
var sslMode = config["DatabaseSettings:SslMode"] ?? "Disable";

// Собираем строку подключения из переменных
var connString = $"Host={host};Port={port};Database={db};Username={username};Password={password};Ssl Mode={sslMode};";

// Добавление строки подключения в конфигурацию
var memoryConfig = new Dictionary<string, string>
{
    { "ConnectionStrings:DefaultConnection", connString }
};
builder.Configuration.AddInMemoryCollection(memoryConfig);

builder.Services.AddIdentityService(builder.Configuration);
builder.Services.AddApplicationServices(builder.Configuration);

ActiveDirectoryConfig.ConfigureActiveDirectoryService(builder.Services, builder.Configuration);

builder.Services.AddControllers();

builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy", policy =>
    {
        policy.AllowAnyHeader()
              .AllowAnyMethod()
              .AllowAnyOrigin();
    });
});

var app = builder.Build();

app.UseCors("CorsPolicy");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
