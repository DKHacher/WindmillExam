using backend;
using Microsoft.EntityFrameworkCore;
using Mqtt.Controllers;
using StackExchange.Redis;
using StateleSSE.AspNetCore.Extensions;
using NSwag;
using NSwag.CodeGeneration.TypeScript;
using Server.Controllers;
using Server.Services;
using StateleSSE.AspNetCore;
using StateleSSE.AspNetCore.GroupRealtime;


var builder = WebApplication.CreateBuilder(args);

// ===== Redis Connection ===== 
builder.Services.AddSingleton<IConnectionMultiplexer>(sp =>
{
    var configuration = sp.GetRequiredService<IConfiguration>();
    var redisConnection = configuration.GetConnectionString("Redis")
                          ?? throw new InvalidOperationException("Redis connection string missing");

    var options = ConfigurationOptions.Parse(redisConnection);
    options.AbortOnConnectFail = false; // recommended for cloud Redis

    return ConnectionMultiplexer.Connect(options);
});



// Add the Redis backplane for real-time updates
builder.Services.AddRedisSseBackplane();
builder.Services.AddEfRealtime();
builder.Services.AddGroupRealtime();
builder.Services.AddSingleton<IMqttCommandService, MqttCommandService>();
builder.Services.AddSingleton<WindmillMqttController>();
// ===== DbContext ===== 
builder.Services.AddDbContextFactory<WindmillDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("Postgres")));

// ===== MQTT Controllers =====
builder.Services.AddMqttControllers();
// ===== Controllers =====
builder.Services.AddControllers();

// ===== OpenAPI / Swagger =====
builder.Services.AddOpenApiDocument(config =>
{
    config.AddSecurity("JWT", new OpenApiSecurityScheme
    {
        Type = OpenApiSecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        Description = "Enter JWT token",
    });
});

// ===== CORS =====
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllOrigins", policy =>
    {
        policy.AllowAnyHeader()
            .AllowAnyMethod()
            .SetIsOriginAllowed(_ => true); // allow any origin
    });
});


// ===== Build App =====
var app = builder.Build();

// ===== Middleware =====
app.UseDefaultFiles();
app.UseStaticFiles();
app.UseRouting();               // ← important
app.UseCors("AllowAllOrigins"); // apply the policy


// ===== Controllers / Endpoints =====
app.MapControllers();



// ===== OpenAPI UI & TS client generation =====
app.UseOpenApi();
app.UseSwaggerUi();

// Generate TypeScript client automatically 
app.GenerateApiClientsFromOpenApi("../client/src/services/generated-ts-client.ts", "./openapi.json").GetAwaiter().GetResult();

// ===== MQTT Client ===== 
var mqtt = app.Services.GetRequiredService<IMqttClientService>();
await mqtt.ConnectAsync("broker.hivemq.com", 1883);

var mqttCommandService = app.Services.GetRequiredService<IMqttCommandService>();
var windmillMqttController = app.Services.GetRequiredService<WindmillMqttController>();

// now the service always knows the handler
mqttCommandService.RegisterHandler(windmillMqttController.CommandFromMediatorAsync);

app.Run();
