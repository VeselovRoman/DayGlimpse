﻿using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using server.Entities;
using server.Interfaces;
using Microsoft.IdentityModel.Tokens;
using Microsoft.VisualBasic;

namespace server.Services
{
    public class TokenService(IConfiguration config) : ITokenService
    {      
        public string CreateToken(Agent agent)
        {
            var tokenKey = config["TokenKey"] ?? throw new Exception("Cannot access tokenKey");
            if (tokenKey.Length < 64) throw new Exception("token need to be longer");
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(tokenKey));           
            
            var claims = new List<Claim>
            {
                new(ClaimTypes.NameIdentifier, agent.Login)
            };

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddDays(30),
                SigningCredentials = creds
            };

            var tokenHandler = new JwtSecurityTokenHandler();

            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }
    }
}