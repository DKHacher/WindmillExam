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
    IGroupRealtimeManager groupRealtimeManager
) : RealtimeControllerBase(backplane)
{
    
    [HttpGet(nameof(GetTelemetry))]
    public async Task<RealtimeListenResponse<List<WindmillTelemetryEntity>>> GetTelemetry([FromQuery] string connectionId)
    {
        if (string.IsNullOrEmpty(connectionId))
            throw new ArgumentException("ConnectionId is required");

        var group = "telemetry";

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

        await backplane.Groups.AddToGroupAsync(connectionId, group);

        realtimeManager.Subscribe<WindmillDbContext>(
            connectionId,
            group,
            criteria: snapshot => snapshot.HasChanges<WindmillAlertEntity>(),
            query: async context => await context.Telemetries.ToListAsync()
        );

        var initial = await db.Alerts.ToListAsync();
        return new RealtimeListenResponse<List<WindmillAlertEntity>>(group, initial);
    }
}
