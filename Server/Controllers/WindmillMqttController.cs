using System.Text.Json;
using Mqtt.Controllers;
using Server.Entities;
using Server.Services;


namespace Server.Controllers;


public class WindmillMqttController(
    ILogger<WindmillMqttController> logger,
    WindmillDbContext ctx,
    IMqttClientService mqttService)
{
    private readonly IMqttClientService mqttService = mqttService; // <-- inject the singleton

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
    
    [MqttRoute("farm/WindmillFarm/windmill/{turbineId}/command")]
    public async Task CommandMqtt(Commands command, string turbineId)
    {
        // Assign ID and timestamp
        command.id = Guid.NewGuid();
        command.turbineId = turbineId;
        command.issuedAt = DateTime.UtcNow.ToString("o");

        logger.LogInformation("Command received: {Command}", JsonSerializer.Serialize(command));

        // Validate action
        var allowedActions = new[] { "Start", "Stop", "Set blade pitch", "Set report interval" };
        if (!allowedActions.Contains(command.action))
        {
            logger.LogWarning("Invalid command action: {Action}", command.action);
            return;
        }

        // Publish to MQTT
        if (mqttService.IsConnected)
        {
            var topic = $"farm/WindmillFarm/windmill/{turbineId}/command";
            var payload = JsonSerializer.Serialize(new { action = command.action, args = command.args });

            await mqttService.PublishAsync(topic, payload);
            logger.LogInformation("Command published to MQTT topic {Topic}", topic);
        }
        else
        {
            logger.LogWarning("MQTT client is not connected!");
        }

        // Save to database
        ctx.Commands.Add(command);
        await ctx.SaveChangesAsync();
    }
}