using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.DTOs;
using Server.Entities;
using Server.Services;
using StateleSSE.AspNetCore;
using StateleSSE.AspNetCore.EfRealtime;

namespace Server.Controllers;

public class WindmillController : RealtimeControllerBase
{
    private readonly WindmillDbContext _ctx;
    private readonly IRealtimeManager _realtime;

    public WindmillController(
        ISseBackplane backplane,
        WindmillDbContext ctx,
        IRealtimeManager realtime)
        : base(backplane)
    {
        this._ctx = ctx;
        _realtime = realtime;
    }
    
    [HttpGet("telemetry-realtime")]
    public async Task<RealtimeListenResponse<List<WindmillTelemetryDTO>>> GetTelemetries(
        string connectionId)
    {
        var group = "stats:windmill:telemetry";

        
        await Backplane.Groups.AddToGroupAsync(connectionId, group);

        
        _realtime.Subscribe<WindmillDbContext>(
            connectionId,
            group,
            criteria: snapshot =>
                snapshot.HasChanges<WindmillTelemetryEntity>(),

            query: async ctx =>
                await ctx.Telemetries
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

        // Initial data for the UI
        var initialData = await _ctx.Telemetries
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

    [HttpPost(nameof(AddTelemetry))]
    public async Task<IActionResult> AddTelemetry([FromBody] WindmillTelemetryDTO telemetry)
    {
        var entity = new WindmillTelemetryEntity
        {
            turbineId = telemetry.turbineId,
            turbineName = telemetry.turbineName,
            farmId = telemetry.farmId,
            timestamp = telemetry.timestamp,
            windSpeed = telemetry.windSpeed,
            windDirection = telemetry.windDirection,
            ambientTemperatur = telemetry.ambientTemperatur,
            rotorSpeed = telemetry.rotorSpeed,
            powerOutput = telemetry.powerOutput,
            nacelleDirection = telemetry.nacelleDirection,
            bladePitch = telemetry.bladePitch,
            generatorTemp = telemetry.generatorTemp,
            gearboxTemp = telemetry.gearboxTemp,
            vibration = telemetry.vibration,
            status = telemetry.status
        };
        _ctx.Telemetries.Add(entity);
        await _ctx.SaveChangesAsync();

        return Ok();
    }
}
