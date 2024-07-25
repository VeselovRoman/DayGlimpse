using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using Novell.Directory.Ldap;

public class ActiveDirectoryService
{
    private readonly string _ldapServer;
    private readonly int _ldapPort;
    private readonly string _domain;
    private readonly string _jwtSecret;

    public ActiveDirectoryService(string ldapServer, int ldapPort, string domain, string jwtSecret)
    {
        _ldapServer = ldapServer ?? throw new ArgumentNullException(nameof(ldapServer));
        _ldapPort = ldapPort;
        _domain = domain ?? throw new ArgumentNullException(nameof(domain));
        _jwtSecret = jwtSecret ?? throw new ArgumentNullException(nameof(jwtSecret));
    }

    public bool AuthenticateUser(string username, string password, out string firstName, out string lastName)
    {
        firstName = null;
        lastName = null;

        try
        {
            using (var connection = new LdapConnection())
            {
                connection.Connect(_ldapServer, _ldapPort);
                connection.Bind($"{username}@{_domain}", password);

                if (connection.Bound)
                {
                    var searchFilter = $"(sAMAccountName={username})";
                    var searchBase = $"dc={_domain.Replace(".", ",dc=")}";
                    var searchResults = connection.Search(
                        searchBase,
                        LdapConnection.ScopeSub,
                        searchFilter,
                        new[] { "givenName", "sn" },
                        false
                    );

                    while (searchResults.HasMore())
                    {
                        var nextEntry = searchResults.Next();
                        var givenNameAttribute = nextEntry.GetAttribute("givenName");
                        var snAttribute = nextEntry.GetAttribute("sn");

                        if (givenNameAttribute != null && snAttribute != null)
                        {
                            firstName = givenNameAttribute.StringValue;
                            lastName = snAttribute.StringValue;
                            return true;
                        }
                    }
                }
            }
        }
        catch (LdapException ex)
        {
            Console.WriteLine($"LdapException: {ex.Message}");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Exception: {ex.Message}");
        }

        return false;
    }

    public string GenerateJwtToken(int agentId, string username, string firstName, string lastName)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(_jwtSecret);
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.Name, username),
                new Claim(ClaimTypes.GivenName, firstName),
                new Claim(ClaimTypes.Surname, lastName),
                new Claim("agentId", agentId.ToString())
            }),
            Expires = DateTime.UtcNow.AddHours(1),
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };
        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }
}
