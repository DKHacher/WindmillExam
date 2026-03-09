using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using backend;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore; 
using Microsoft.IdentityModel.Tokens;
using Server.Entities;
using Server.Services;

namespace Server.Controllers;

public class AuthController
{
    private readonly WindmillDbContext _ctx;
    public AuthController (WindmillDbContext ctx)
    {
        _ctx = ctx;
    }

    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var user = await _ctx.Users.FirstOrDefaultAsync(u => u.Name == request.Email);

        if (user == null)
            return new UnauthorizedObjectResult("Invalid username or password");

        if (user.Password != request.Password)
            return new UnauthorizedObjectResult("Invalid username or password");

        var token = GenerateJwt(user);

        return new OkObjectResult(new
        {
            token,
            username = user.Name,
            role = user.Role
        });
        return null;
    }   
    
    private string GenerateJwt(User user)
    {
        var secret = new AppOptions().JwtSecret ;

        if (string.IsNullOrWhiteSpace(secret))
            throw new Exception("JWT_SECRET is missing.");

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.Name, user.Name),
            new Claim(ClaimTypes.Role, user.Role),
        };

        var token = new JwtSecurityToken(
            claims: claims,
            expires: DateTime.UtcNow.AddHours(1),
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}