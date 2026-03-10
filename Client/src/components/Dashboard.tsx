import {useEffect, useState} from "react";
import WindTurbine from "./WindTurbine.tsx";
import TurbineDetails from "./TurbineDetails.tsx";
import { telemetryAtom } from "../atoms/telemetryAtom.ts";
import { restClient, sse } from "../services/sse.ts";
import { WindmillTelemetryEntity } from "../services/generated-ts-client.ts";
import { useAtom } from "jotai";
import {windmillAtom} from "../atoms/windmillAtom.ts";

function Dashboard() {
    const [selectedTurbine, setSelectedTurbine] = useState<WindmillTelemetryEntity | null>(null);
    const [, setTelemetry] = useAtom(telemetryAtom);
    const [windmills, setWindmills] = useAtom(windmillAtom);

    useEffect(() => {

        sse.listen(async (id) => {
            const result = await restClient.getTelemetry(id);
            return result;
        }, (data) => {
            setTelemetry(data);

            const latest = new Map<string, WindmillTelemetryEntity>();

            for (const turbine of data) {
                if (!turbine.turbineId || !turbine.timestamp) continue;

                const existing = latest.get(turbine.turbineId);

                if (!existing || turbine.timestamp > (existing.timestamp ?? "")) {
                    latest.set(turbine.turbineId, turbine);
                }
            }

            setWindmills(Array.from(latest.values()));
        })
    }, [setTelemetry, setWindmills]);

    return (
        <div style={{
            textAlign:"center",
            backgroundColor: "#0f172a",
            minHeight: "100vh",
            color: "white"
        }}>
            <h1>Windmill Dashboard</h1>

            {windmills.map(turbine => (
                <div
                    key={turbine.turbineId}
                    style={{
                        marginBottom: "15px",
                        marginRight: "15px",
                        borderRadius: "8px",
                        backgroundColor: "#1e293b",
                        display: "inline-block",
                        transition: "background-color 0.2s"
                    }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#273449")}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#1e293b")}
                >
                    <WindTurbine
                        turbine={turbine}
                        onClick={() => setSelectedTurbine(turbine)}
                    />
                    <div style={{ marginTop: "5px", fontWeight: "bold" }}>
                        <span>{turbine.turbineName ?? "Unknown"}</span> -{" "}
                        <span>
                            {turbine.status?.toUpperCase() ?? "N/A"}{" "}
                            {turbine.status === "running" ? "🟢" : turbine.status === "stopped" ? "🔴" : ""}
                        </span>
                    </div>
                </div>
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