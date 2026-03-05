using System.ComponentModel.DataAnnotations;

namespace backend;

public class AppOptions
{
    [MinLength(1)]
    public string JwtSecret { get; set; } = string.Empty;
}