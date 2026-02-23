namespace Server.Entities;

public class WindmillTelemetryEntity
{
    public int windmillId { get; set; }
    public int windSpeed { get; set; }
    public int powerOutput { get; set; }
    public int temperature { get; set; }
    public DateTime Timestamp { get; set; }
}