import {useAtom} from "jotai";
import {turbineTelemetryAtom} from "../atoms/turbineTelemetryAtom.ts";


function WindmillInformationPage() {
    const [turbineTelemetry] = useAtom(turbineTelemetryAtom);

    if (!turbineTelemetry || turbineTelemetry.length === 0) {
        return <p>No telemetry available</p>;
    }

    return(
        <>
            <h1>Turbine information</h1>
            {turbineTelemetry.map((telemetry, index) => (
                <div key={index} style={{ marginBottom: "1rem" }}>
                    <p><strong>Name:</strong> {telemetry.turbineName}</p>
                    <p><strong>Time of report:</strong> {new Date(telemetry.timestamp).toLocaleString()}</p>
                    <p><strong>Wind speed:</strong> {telemetry.windSpeed}</p>
                    <p><strong>Wind direction:</strong> {telemetry.windDirection}</p>
                    <p><strong>Ambient temperature:</strong> {telemetry.ambientTemperature}</p>
                    <p><strong>Rotor speed:</strong> {telemetry.rotorSpeed}</p>
                    <p><strong>Power output:</strong> {telemetry.powerOutput}</p>
                    <p><strong>Nacelle direction:</strong> {telemetry.nacelleDirection}</p>
                    <p><strong>Blade pitch:</strong> {telemetry.bladePitch}</p>
                    <p><strong>Generator temperature:</strong> {telemetry.generatorTemp}</p>
                    <p><strong>Gearbox temperature:</strong> {telemetry.gearboxTemp}</p>
                    <p><strong>Vibration:</strong> {telemetry.vibration}</p>
                    <p><strong>Status:</strong> {telemetry.status}</p>
                </div>
            ))}
        </>
    )
}

export default WindmillInformationPage;