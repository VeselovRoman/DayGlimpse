using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using server.Extensions;
using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;



var builder = WebApplication.CreateBuilder(args);

// Получаем конфигурацию
var config = builder.Configuration;

// Переменные из конфигурации
var host = config["DatabaseSettings:Host"] ?? "rc1a-3v5gm1c2hgmoxknv.mdb.yandexcloud.net";
var port = config["DatabaseSettings:Port"] ?? "6432";
var db = config["DatabaseSettings:Database"] ?? "dayglimpse_db";
var username = config["DatabaseSettings:Username"] ?? "Admin";
var password = config["DatabaseSettings:Password"] ?? "iTSiz9bEMYxSwj7";

// Собираем строку подключения из переменных
var connString = $"Host={host};Port={port};Database={db};Username={username};Password={password};Ssl Mode=VerifyFull;";

// Добавляем различия для разных ОС
if (IsWindows())
{
    connString += @"Root Certificate=C:\Users\Roman\.postgresql\root.crt;";
}
else if (IsMac())
{
    connString += @"Root Certificate=/Users/romanveselov/.postgresql/root.crt;";
}
else if (IsLinux())
{
    connString += @"Root Certificate=/etc/ssl/certs/root.crt;";
}

// Добавление строки подключения в конфигурацию
var memoryConfig = new Dictionary<string, string>
{
    { "ConnectionStrings:DefaultConnection", connString }
};

builder.Configuration.AddInMemoryCollection(memoryConfig);

// Add services to the container.

builder.Services.AddApplicationServices(builder.Configuration);

builder.Services.AddControllers();
builder.Services.AddSingleton(new ActiveDirectoryService(
    "172.16.11.213",
    389, 
    "trcont.ru",
    "this is my super secret unguessable key which can solve only my friend of mine Alex"));

// Добавьте необходимые пакеты для аутентификации
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes("this is my super secret unguessable key which can solve only my friend of mine Alex")),
        ValidateIssuer = false,
        ValidateAudience = false
    };
});

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

var app = builder.Build();

app.UseCors("CorsPolicy");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();

static bool IsWindows()
{
    return Environment.OSVersion.Platform == PlatformID.Win32NT;
}

static bool IsMac()
{
    return Environment.OSVersion.Platform == PlatformID.MacOSX || (Environment.OSVersion.Platform == PlatformID.Unix && Directory.Exists("/Applications"));
}

static bool IsLinux()
{
    return Environment.OSVersion.Platform == PlatformID.Unix && !IsMac();
}
