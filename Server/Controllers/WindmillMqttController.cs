using System.Text.Json;
using Mqtt.Controllers;
using Server.Entities;
using Server.Services;


namespace Server.Controllers;


public class WindmillMqttController(ILogger<WindmillMqttController> logger, WindmillDbContext ctx)
{

    [MqttRoute("station/aaa/sensor/{turbineId}/telemetry")]
    public async Task ListenForTelemetries(WindmillTelemetryEntity telemetry, string turbineId)
    {
        logger.LogInformation(JsonSerializer.Serialize(telemetry));
        telemetry.Id = Guid.NewGuid();
        ctx.Telemetries.Add(telemetry);
        await ctx.SaveChangesAsync();
    }
}