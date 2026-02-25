export type Telemetry = {
    turbineId: string;
    turbineName: string;
    farmId: string;
    timestamp: Date;
    windSpeed: number;
    windDirection: number;
    ambientTemperature: number;
    rotorSpeed: number;
    powerOutput: number;
    nacelleDirection: number;
    bladePitch: number;
    generatorTemp: number;
    gearboxTemp: number;
    vibration: number;
    status: string;
};