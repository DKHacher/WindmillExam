using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.DTOs;
using Server.Entities;
using Server.Services;
using StateleSSE.AspNetCore;
using StateleSSE.AspNetCore.EfRealtime;
using StateleSSE.AspNetCore.GroupRealtime;

namespace Server.Controllers;

public class WindmillController(
    ISseBackplane backplane,
    IRealtimeManager realtimeManager,
    WindmillDbContext db,
    IGroupRealtimeManager groupRealtimeManager,
    IMqttCommandService mqttCommandService
    
) : RealtimeControllerBase(backplane)
{
    private readonly IMqttCommandService _mqttCommandService = mqttCommandService;
    
    [HttpGet(nameof(GetTelemetry))]
    public async Task<RealtimeListenResponse<List<WindmillTelemetryEntity>>> GetTelemetry([FromQuery] string connectionId)
    {
        if (string.IsNullOrEmpty(connectionId))
            throw new ArgumentException("ConnectionId is required");

        var group = "telemetry";
        
        Response.Headers.Add("Access-Control-Allow-Origin", "http://89.168.89.95");
        Response.Headers.Add("Access-Control-Allow-Credentials", "true");
        Response.Headers.Add("Cache-Control", "no-cache");
        Response.ContentType = "text/event-stream";
        await Response.Body.FlushAsync(); // <-- ensure browser receives headers now

        await backplane.Groups.AddToGroupAsync(connectionId, group);

        realtimeManager.Subscribe<WindmillDbContext>(
            connectionId,
            group,
            criteria: snapshot => snapshot.HasChanges<WindmillTelemetryEntity>(),
            query: async context => await context.Telemetries.ToListAsync()
        );

        var initial = await db.Telemetries.ToListAsync();
        return new RealtimeListenResponse<List<WindmillTelemetryEntity>>(group, initial);
    }
    
    [HttpGet(nameof(GetAlert))]
    public async Task<RealtimeListenResponse<List<WindmillAlertEntity>>> GetAlert([FromQuery] string connectionId)
    {
        if (string.IsNullOrEmpty(connectionId))
            throw new ArgumentException("ConnectionId is required");

        var group = "alert";
        
        Response.Headers.Add("Access-Control-Allow-Origin", "http://89.168.89.95");
        Response.Headers.Add("Access-Control-Allow-Credentials", "true");
        Response.Headers.Add("Cache-Control", "no-cache");
        Response.ContentType = "text/event-stream";
        await Response.Body.FlushAsync(); // <-- ensure browser receives headers now
        await backplane.Groups.AddToGroupAsync(connectionId, group);

        realtimeManager.Subscribe<WindmillDbContext>(
            connectionId,
            group,
            criteria: snapshot => snapshot.HasChanges<WindmillAlertEntity>(),
            query: async context => await context.Alerts.ToListAsync()
        );

        var initial = await db.Alerts.ToListAsync();
        return new RealtimeListenResponse<List<WindmillAlertEntity>>(group, initial);
    }
    
    private async Task SendCommandAsync(string turbineId, string action, string payload)
    {
        // Forward command to the mediator service
        await _mqttCommandService.SendCommandAsync(turbineId, action, payload);
    }
    
    [HttpPost(nameof(SetReportInterval))]
    public async Task SetReportInterval([FromQuery] string turbineId, [FromQuery] int intervalSeconds)
    {
        if (string.IsNullOrEmpty(turbineId))
            throw new ArgumentException("TurbineId is required");

        var payload = JsonSerializer.Serialize(new { action = "setInterval", value = intervalSeconds });
        await SendCommandAsync(turbineId, "setInterval", payload);
    }

    [HttpPost(nameof(StartTurbine))]
    public async Task StartTurbine([FromQuery] string turbineId)
    {
        var payload = JsonSerializer.Serialize(new { action = "start" });
        await SendCommandAsync(turbineId, "start", payload);
    }

    [HttpPost(nameof(StopTurbine))]
    public async Task StopTurbine([FromQuery] string turbineId, [FromQuery] string reason = "")
    {
        var payload = JsonSerializer.Serialize(new { action = "stop", reason });
        await SendCommandAsync(turbineId, "stop", payload);
    }

    [HttpPost(nameof(SetBladePitch))]
    public async Task SetBladePitch([FromQuery] string turbineId, [FromQuery] double angle)
    {
        var payload = JsonSerializer.Serialize(new { action = "setPitch", angle });
        await SendCommandAsync(turbineId, "setPitch", payload);
    }
}
