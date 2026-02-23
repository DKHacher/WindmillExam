using Microsoft.EntityFrameworkCore;
using Mqtt.Controllers;
using StackExchange.Redis;
using StateleSSE.AspNetCore.Extensions;
using NSwag;
using NSwag.CodeGeneration.TypeScript;
using StateleSSE.AspNetCore;
using StateleSSE.AspNetCore.GroupRealtime;


var builder = WebApplication.CreateBuilder(args);

// ===== Redis Connection ===== currently will fail since no connection string has been created in appsettings TODO: fix
builder.Services.AddSingleton<IConnectionMultiplexer>(sp =>
{
    var configuration = sp.GetRequiredService<IConfiguration>();
    var redisConnection = configuration.GetConnectionString("Redis")
                          ?? throw new InvalidOperationException("Redis connection string missing");

    var options = StackExchange.Redis.ConfigurationOptions.Parse(redisConnection);
    options.AbortOnConnectFail = false; // recommended for cloud Redis

    return StackExchange.Redis.ConnectionMultiplexer.Connect(options);
});



// Add the Redis backplane for real-time updates
builder.Services.AddRedisSseBackplane();
builder.Services.AddEfRealtime();
builder.Services.AddGroupRealtime();
// ===== DbContext ===== currently no db context exists, once it does remember to add connectionstring to appsettings TODO: fix
//builder.Services.AddDbContext<WeatherDbContext>(options =>
    //options.UseNpgsql(builder.Configuration.GetConnectionString("Postgres")));

// ===== MQTT Controllers =====
builder.Services.AddMqttControllers();

// ===== Controllers =====
builder.Services.AddControllers();

// ===== OpenAPI / Swagger =====
builder.Services.AddOpenApiDocument();

// ===== CORS =====
builder.Services.AddCors();

// ===== Build App =====
var app = builder.Build();

// ===== Middleware =====
app.UseDefaultFiles();
app.UseStaticFiles();
app.UseCors(c => 
    c.AllowAnyHeader()
        .AllowAnyMethod()
        .AllowAnyOrigin()
        .SetIsOriginAllowed(_ => true));


// ===== Controllers / Endpoints =====
app.MapControllers();



// ===== OpenAPI UI & TS client generation =====
app.UseOpenApi();
app.UseSwaggerUi();

// Generate TypeScript client automatically missing the generation file TODO: fix
//app.GenerateApiClientsFromOpenApi("../frontend/src/generated-ts-client.ts", "./openapi.json").GetAwaiter().GetResult();

// ===== MQTT Client =====
var mqtt = app.Services.GetRequiredService<IMqttClientService>();
await mqtt.ConnectAsync("broker.hivemq.com", 1883);

app.Run();
