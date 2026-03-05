using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Mqtt.Controllers;
using NSwag.CodeGeneration;
using Server.Entities;
using Server.Services;


namespace Server.Controllers;


public class WindmillMqttController : MqttController
{
    private readonly IMqttClientService _mqttService;
    private readonly IMqttCommandService _mqttCommandService;
    private readonly ILogger<WindmillMqttController> _logger;
    private readonly IDbContextFactory<WindmillDbContext> _ctxFactory;

    public WindmillMqttController(
        ILogger<WindmillMqttController> logger,
        IDbContextFactory<WindmillDbContext> ctx,
        IMqttClientService mqttService,
        IMqttCommandService mqttCommandService)
    {
        _logger = logger;
        _ctxFactory = ctx;
        _mqttService = mqttService;
        _mqttCommandService = mqttCommandService;
        _mqttCommandService.RegisterHandler(CommandFromMediatorAsync);
    }
    
    public async Task CommandFromMediatorAsync(string turbineId, string action, string payload)
    {
        var command = new Commands
        {
            action = action,
            args = payload
        };

        await CommandMqtt(command, turbineId);
    }
    
    
    [MqttRoute("farm/WindmillFarm/windmill/{turbineId}/telemetry")]
    public async Task ListenForTelemetries(WindmillTelemetryEntity telemetry, string turbineId)
    {
        _logger.LogInformation(JsonSerializer.Serialize(telemetry));
        telemetry.Id = Guid.NewGuid();
        try
        {
            using var ctx = _ctxFactory.CreateDbContext();
            ctx.Telemetries.Add(telemetry);
            await ctx.SaveChangesAsync();
            _logger.LogInformation("Telemetry saved successfully");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to save telemetry to DB");
        }
    }
    [MqttRoute("farm/WindmillFarm/windmill/{turbineId}/alert")]
    public async Task ListenForAlerts(WindmillAlertEntity alert, string turbineId)
    {
        _logger.LogInformation(JsonSerializer.Serialize(alert));
        alert.Id = Guid.NewGuid();
        try
        {
            using var ctx = _ctxFactory.CreateDbContext();
            ctx.Alerts.Add(alert);
            await ctx.SaveChangesAsync();
            _logger.LogInformation("Alert saved successfully");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to save alert to DB");
        }
    }
    
    [ MqttRoute("farm/WindmillFarm/windmill/{turbineId}/command") ]
    public async Task CommandMqtt(Commands command, string turbineId)
    {
        command.id = Guid.NewGuid();
        command.turbineId = turbineId;
        command.issuedAt = DateTime.UtcNow.ToString("o");

        string payload = command.args; // already JSON string from frontend

        if (_mqttService.IsConnected)
        {
            var topic = $"farm/WindmillFarm/windmill/{turbineId}/command";
            await _mqttService.PublishAsync(topic, payload);
            _logger.LogInformation("Command published to MQTT topic {Topic}", topic);
        }

        try
        {
            using var ctx = _ctxFactory.CreateDbContext();
            ctx.Commands.Add(command);
            await ctx.SaveChangesAsync();
            _logger.LogInformation("Command saved successfully");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to save command to DB");
        }
    }
}