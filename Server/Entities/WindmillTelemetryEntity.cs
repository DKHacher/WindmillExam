namespace Server.Entities;

public class WindmillTelemetryEntity
{
    public Guid Id { get; set; }
    public string turbineId { get; set; }
    public string turbineName { get; set; }
    public string farmId { get; set; }
    public DateTime timestamp { get; set; }
    public float windSpeed { get; set; }
    public float windDirection { get; set; }
    public float ambientTemperatur { get; set; }
    public float rotorSpeed { get; set; }
    public float powerOutput { get; set; }
    public float nacelleDirection { get; set; }
    public float bladePitch { get; set; }
    public float generatorTemp { get; set; }
    public float gearboxTemp { get; set; }
    public float vibration { get; set; }
    public string status { get; set; }
}