using Microsoft.AspNetCore.Mvc;
using Server.DTOs;
using Server.Entities;
using Server.Services;
using StateleSSE.AspNetCore;
using StateleSSE.AspNetCore.EfRealtime;

namespace Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class WindmillController(ISseBackplane backplane, WindmillDbContext _ctx, IRealtimeManager realtimeManager)
    : RealtimeControllerBase(backplane)
{
    private readonly WindmillDbContext _context = _ctx;
    private readonly IRealtimeManager _realtimeManager = realtimeManager;

    [HttpPost]
    public async Task<IActionResult> AddTelemetry(WindmillTelemetryDTO telemetry)
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

        _context.Telemetries.Add(entity);
        await _context.SaveChangesAsync();

        return Ok();
    }
}