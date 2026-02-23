namespace Server.Entities;

public class WindmillAlertEntity
{
    public int windmillId { get; set; }
    public string alertType { get; set; }
    public DateTime triggeredAt { get; set; }
    public string messagge { get; set; }
}