using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Alerts",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    turbineId = table.Column<string>(type: "text", nullable: false),
                    farmId = table.Column<string>(type: "text", nullable: false),
                    timestamp = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    severity = table.Column<string>(type: "text", nullable: false),
                    message = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Alerts", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Telemetries",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    turbineId = table.Column<string>(type: "text", nullable: false),
                    turbineName = table.Column<string>(type: "text", nullable: false),
                    farmId = table.Column<string>(type: "text", nullable: false),
                    timestamp = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    windSpeed = table.Column<float>(type: "real", nullable: false),
                    windDirection = table.Column<float>(type: "real", nullable: false),
                    ambientTemperatur = table.Column<float>(type: "real", nullable: false),
                    rotorSpeed = table.Column<float>(type: "real", nullable: false),
                    powerOutput = table.Column<float>(type: "real", nullable: false),
                    nacelleDirection = table.Column<float>(type: "real", nullable: false),
                    bladePitch = table.Column<float>(type: "real", nullable: false),
                    generatorTemp = table.Column<float>(type: "real", nullable: false),
                    gearboxTemp = table.Column<float>(type: "real", nullable: false),
                    vibration = table.Column<float>(type: "real", nullable: false),
                    status = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Telemetries", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Alerts");

            migrationBuilder.DropTable(
                name: "Telemetries");
        }
    }
}
