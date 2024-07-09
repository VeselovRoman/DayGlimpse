using Npgsql;

namespace ConsoleApp
{
    class Program
    {
        static async Task Main(string[] args)
        {
            var host       = "rc1a-b2jiiom6m0qzhcz1.mdb.yandexcloud.net";
            var port       = "6432";
            var db         = "dayglimpse_db";
            var username   = "Admin";
            var password   = "iTSiz9bEMYxSwj7";
            var connString = $"Host={host};Port={port};Database={db};Username={username};Password={password};Ssl Mode=VerifyFull;";

            await using var conn = new NpgsqlConnection(connString);
            await conn.OpenAsync();

            await using (var cmd = new NpgsqlCommand("SELECT VERSION();", conn))
            await using (var reader = await cmd.ExecuteReaderAsync())
            {
                while (await reader.ReadAsync())
                {
                    Console.WriteLine(reader.GetInt32(0));
                }
            }
        }
    }
}
