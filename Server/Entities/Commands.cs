namespace Server.Entities;

public class Commands
{
    public Guid id { get; set; }
    public int userId { get; set; }
    public string turbineId { get; set; }
    public string action { get; set; }
    public string args { get; set; }
    public string issuedAt { get; set; }
}