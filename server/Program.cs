using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using server.Extensions;
using System;
using System.Collections.Generic;
using System.IO;


var builder = WebApplication.CreateBuilder(args);

// Получаем конфигурацию
var config = builder.Configuration;

// Переменные из конфигурации
var host = config["DatabaseSettings:Host"] ?? "rc1a-b2jiiom6m0qzhcz1.mdb.yandexcloud.net";
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
builder.Services.AddIdentityService(builder.Configuration);

builder.Services.AddControllers();

// Configure the HTTP request pipeline.
//app.UseCors(x => x.AllowAnyHeader().AllowAnyMethod()
    //.WithOrigins("http://localhost:4200", "https://localhost:4200"));

// Add CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy", policy =>
    {
        policy.AllowAnyHeader()
              .AllowAnyMethod()
              .WithOrigins("http://localhost:4200", "https://localhost:4200", "http://158.160.134.124");
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
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
