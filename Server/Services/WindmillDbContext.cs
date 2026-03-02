using Microsoft.EntityFrameworkCore;
using Server.Entities;
namespace Server.Services;

public class WindmillDbContext : DbContext
{
    public WindmillDbContext(DbContextOptions<WindmillDbContext> options)
        : base(options)
    {
    }

    public DbSet<WindmillTelemetryEntity> Telemetries => Set<WindmillTelemetryEntity>(); 
    public DbSet<WindmillAlertEntity> Alerts => Set<WindmillAlertEntity>();
}