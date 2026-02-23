using Microsoft.EntityFrameworkCore;

namespace Server.Services;

public class WindmillDbContext : DbContext
{
    public WindmillDbContext(DbContextOptions<WindmillDbContext> options)
        : base(options)
    {
    }

    //public DbSet<Telemetry> Telemetries => Set<Telemetry>(); //TODO: add entities and dbsets of those entities 
}