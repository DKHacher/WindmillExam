namespace Server.DTOs;

public class LoginResponseDTO
{
    public string Token { get; set; }
    public string Email { get; set; }
    public string Role { get; set; }
}