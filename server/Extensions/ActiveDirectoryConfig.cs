using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace server.Helpers
{
    public static class ActiveDirectoryConfig
    {
        public static void ConfigureActiveDirectoryService(IServiceCollection services, IConfiguration config)
        {
            var adHost = config["ActiveDirectorySettings:Host"];
            var adPort = int.Parse(config["ActiveDirectorySettings:Port"]);
            var adDomain = config["ActiveDirectorySettings:Domain"];
            var adTokenKey = config["TokenKey"];

            services.AddSingleton(new ActiveDirectoryService(adHost, adPort, adDomain, adTokenKey));
        }
    }
}
