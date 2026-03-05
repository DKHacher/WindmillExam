import {useEffect, useState} from "react";
import WindTurbine from "./WindTurbine.tsx";
import TurbineDetails from "./TurbineDetails.tsx";
import {telemetryAtom} from "../atoms/telemetryAtom.ts";
import {restClient, sse} from "../services/sse.ts";
import {WindmillTelemetryDTO} from "../services/generated-ts-client.ts";
import {useAtom} from "jotai";

function Dashboard() {
    const [selectedTurbine, setSelectedTurbine] = useState<WindmillTelemetryDTO | null>(null);
    const [telemetry, setTelemetry] = useAtom(telemetryAtom);

    useEffect(() => {

        sse.listen(async (id) => {
            return await restClient.getTelemetries(id);
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
        </div>
    );
};

export default Dashboard;