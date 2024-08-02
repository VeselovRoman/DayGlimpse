using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Server.Kestrel.Core;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

public static class KestrelConfiguration
{
    public static void ConfigureKestrel(WebHostBuilderContext context, KestrelServerOptions options)
    {
        var kestrelConfig = context.Configuration.GetSection("Kestrel");

        // Настройка HTTP
        options.ListenLocalhost(5000);

        // Настройка HTTPS
        var httpsSection = kestrelConfig.GetSection("Endpoints:Https");
        if (httpsSection.Exists())
        {
            var httpsUrl = httpsSection["Url"];
            var certPath = httpsSection["Certificate:Path"];
            var keyPath = httpsSection["Certificate:KeyPath"];

            options.ListenLocalhost(5001, listenOptions =>
            {
                listenOptions.UseHttps(certPath, keyPath);
            });
        }
    }
}
