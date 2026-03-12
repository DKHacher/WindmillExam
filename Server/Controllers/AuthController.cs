using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using backend;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Server.DTOs;
using Server.Entities;
using Server.Services;

namespace Server.Controllers;
[ApiController]
[Route("auth")]
public class AuthController : ControllerBase
{
    private readonly WindmillDbContext _ctx;
    private readonly AppOptions _appOptions;
    public AuthController (WindmillDbContext ctx, IOptions<AppOptions> appOptions)
    {
        _ctx = ctx;
        _appOptions = appOptions.Value;
    }

    [HttpPost(nameof(Login))]
    [ProducesResponseType(typeof(LoginResponseDTO), StatusCodes.Status200OK)]
    public async Task<ActionResult<LoginResponseDTO>> Login([FromBody] LoginRequest request)
    {
        var user = await _ctx.Users.FirstOrDefaultAsync(u => u.Email == request.Email);

        if (user == null || user.Password != request.Password)
            return  Unauthorized("Invalid email or password");

        var token = GenerateJwt(user);

        return new LoginResponseDTO()
        {
            Token = token,
            Email = user.Email,
            Role = user.Role,
        };
    }   
    
    private string GenerateJwt(User user)
    {
        var secret = _appOptions.JwtSecret;

        if (string.IsNullOrWhiteSpace(secret))
            throw new Exception("JWT_SECRET is missing.");

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Role, user.Role),
        };

        var token = new JwtSecurityToken(
            claims: claims,
            expires: DateTime.UtcNow.AddHours(1),
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}