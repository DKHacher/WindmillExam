namespace Server.Entities;

public class WindmillAlertEntity
{
    public string turbineId { get; set; }
    public string farmId { get; set; }
    public DateTime timestamp { get; set; }
    public string severity { get; set; }
    public string message { get; set; }
}