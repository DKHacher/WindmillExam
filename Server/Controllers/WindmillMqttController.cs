using System.Text.Json;
using Mqtt.Controllers;
using Server.Entities;
using Server.Services;


namespace Server.Controllers;


public class WindmillMqttController(ILogger<WindmillMqttController> logger, WindmillDbContext ctx)
{

    [MqttRoute("farm/WindmillFarm/windmill/{turbineId}/telemetry")]
    public async Task ListenForTelemetries(WindmillTelemetryEntity telemetry, string turbineId)
    {
        logger.LogInformation(JsonSerializer.Serialize(telemetry));
        telemetry.Id = Guid.NewGuid();
        ctx.Telemetries.Add(telemetry);
        await ctx.SaveChangesAsync();
    }
    [MqttRoute("farm/WindmillFarm/windmill/{turbineId}/alert")]
    public async Task ListenForAlerts(WindmillAlertEntity alert, string turbineId)
    {
        logger.LogInformation(JsonSerializer.Serialize(alert));
        alert.Id = Guid.NewGuid();
        ctx.Alerts.Add(alert);
        await ctx.SaveChangesAsync();
    }
    
    /*[MqttRoute("farm/WindmillFarm/windmill/{turbineId}/command")] //TODO: missing command entity
    public async Task CommandMqtt(WindmillAlertEntity alert, string turbineId)
    {
        logger.LogInformation(JsonSerializer.Serialize(alert));
        alert.Id = Guid.NewGuid();
        ctx.Alerts.Add(alert);
        await ctx.SaveChangesAsync();
    }*/
}