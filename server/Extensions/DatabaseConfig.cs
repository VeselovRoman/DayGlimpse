using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;

namespace server.Helpers
{
    public static class DatabaseConfig
    {
        public static void ConfigureDatabase(IConfigurationBuilder configurationBuilder)
        {
            // Переменные из конфигурации
            var config = configurationBuilder.Build();
            var host = config["DatabaseSettings:Host"];
            var port = config["DatabaseSettings:Port"];
            var db = config["DatabaseSettings:Database"];
            var username = config["DatabaseSettings:Username"];
            var password = config["DatabaseSettings:Password"];

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

            configurationBuilder.AddInMemoryCollection(memoryConfig);
        }

        private static bool IsWindows()
        {
            return Environment.OSVersion.Platform == PlatformID.Win32NT;
        }

        private static bool IsMac()
        {
            return Environment.OSVersion.Platform == PlatformID.MacOSX || (Environment.OSVersion.Platform == PlatformID.Unix && Directory.Exists("/Applications"));
        }

        private static bool IsLinux()
        {
            return Environment.OSVersion.Platform == PlatformID.Unix && !IsMac();
        }
    }
}
