import {useEffect, useState} from "react";
import WindTurbine from "./WindTurbine.tsx";
import TurbineDetails from "./TurbineDetails.tsx";
import {useAtom} from "jotai/react/useAtom";
import {telemetryAtom} from "../atoms/telemetryAtom.ts";
import {restClient, sse} from "../services/sse.ts";
import {WindmillTelemetryDTO} from "../services/generated-ts-client.ts";

function Dashboard() {
    const [windSpeed, setWindSpeed] = useState<number>(15);
    const [selectedTurbine, setSelectedTurbine] = useState<WindmillTelemetryDTO | null>(null);

    const [telemetry, setTelemetry] = useAtom(telemetryAtom);

    useEffect(() => {

        sse.listen(async (id) => {
            const result = await restClient.getTelemetries(id);
            return result;
        }, (data) => {
            setTelemetry(data);
        })
    }, [setTelemetry]);

    return (
        <div style={{ textAlign:"center" }}>
            <h1>Windmill Dashboard</h1>

            {telemetry.map(turbine => (
                <WindTurbine
                    key={turbine.turbineId}
                    turbine={turbine}
                    onClick={() => setSelectedTurbine(turbine)}
                />
            ))}

            {selectedTurbine && (
                <TurbineDetails
                    turbine={selectedTurbine}
                    onClose={() => setSelectedTurbine(null)}
                />
            )}


            <div style={{marginTop: "20px"}}>
                <input
                    type="range"
                    min="0"
                    max="25"
                    value={windSpeed}
                    onChange={(e) => setWindSpeed(Number(e.target.value))}
                />
                <p>Wind Speed: {windSpeed} m/s</p>
            </div>
        </div>
    );
};

export default Dashboard;