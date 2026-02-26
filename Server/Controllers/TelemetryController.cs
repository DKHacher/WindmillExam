using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.DTOs;
using Server.Entities;
using Server.Services;
using StateleSSE.AspNetCore;
using StateleSSE.AspNetCore.EfRealtime;

namespace Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TelemetryController(ISseBackplane backplane, WindmillDbContext _ctx, IRealtimeManager realtimeManager)
    : RealtimeControllerBase(backplane)
{
    private readonly WindmillDbContext _context = _ctx;
    private readonly IRealtimeManager _realtimeManager = realtimeManager;

    [HttpGet("realtime")]
    public async Task<RealtimeListenResponse<List<WindmillTelemetryDTO>>> ListenRealtime(
        string connectionId,
        string turbineId)
    {
        var group = $"telemetry:{turbineId}";
        
        await backplane.Groups.AddToGroupAsync(connectionId, group);

        realtimeManager.Subscribe<WindmillDbContext>(
            connectionId,
            group,
            criteria: changes =>
                changes.OfType<WindmillTelemetryEntity>().Any(e => e.Entity.turbineId == turbineId),
            query: async ctx => await ctx.Telemetries
                .Where(t => t.turbineId == turbineId)
                .OrderByDescending(t => t.timestamp)
                .Take(50)
                .Select(t => new WindmillTelemetryDTO
                {
                    turbineId = t.turbineId,
                    turbineName = t.turbineName,
                    farmId = t.farmId,
                    timestamp = t.timestamp,
                    windSpeed = t.windSpeed,
                    windDirection = t.windDirection,
                    ambientTemperatur = t.ambientTemperatur,
                    rotorSpeed = t.rotorSpeed,
                    powerOutput = t.powerOutput,
                    nacelleDirection = t.nacelleDirection,
                    bladePitch = t.bladePitch,
                    generatorTemp = t.generatorTemp,
                    gearboxTemp = t.gearboxTemp,
                    vibration = t.vibration,
                    status = t.status
                })
                .ToListAsync()
        );

        var initialData = await _context.Telemetries
            .Where(t => t.turbineId == turbineId)
            .OrderByDescending(t => t.timestamp)
            .Take(50)
            .Select(t => new WindmillTelemetryDTO
            {
                turbineId = t.turbineId,
                turbineName = t.turbineName,
                farmId = t.farmId,
                timestamp = t.timestamp,
                windSpeed = t.windSpeed,
                windDirection = t.windDirection,
                ambientTemperatur = t.ambientTemperatur,
                rotorSpeed = t.rotorSpeed,
                powerOutput = t.powerOutput,
                nacelleDirection = t.nacelleDirection,
                bladePitch = t.bladePitch,
                generatorTemp = t.generatorTemp,
                gearboxTemp = t.gearboxTemp,
                vibration = t.vibration,
                status = t.status
            })
            .ToListAsync();

        return new RealtimeListenResponse<List<WindmillTelemetryDTO>>(group, initialData);
    }
}
