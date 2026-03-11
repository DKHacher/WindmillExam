import {useEffect, useState} from "react";
import WindTurbine from "./WindTurbine.tsx";
import TurbineDetails from "./TurbineDetails.tsx";
import { telemetryAtom } from "../atoms/telemetryAtom.ts";
import {createSSE, restClient} from "../services/sse.ts";
import { WindmillTelemetryEntity } from "../services/generated-ts-client.ts";
import { useAtom } from "jotai";
import {windmillAtom} from "../atoms/windmillAtom.ts";
import {alertAtom} from "../atoms/alertAtom.ts";
import toast from "react-hot-toast";

function Dashboard() {
    const [selectedTurbine, setSelectedTurbine] = useState<WindmillTelemetryEntity | null>(null);
    const [, setTelemetry] = useAtom(telemetryAtom);
    const [, setAlerts] = useAtom(alertAtom);
    const [windmills, setWindmills] = useAtom(windmillAtom);

    useEffect(() => {
        const sse = createSSE();

        const telemetryUnsub = sse.listen(
            async (id) => await restClient.getTelemetry(id),
            (data) => {
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
        });


        const alertUnsub = sse.listen(
            async (id) => await restClient.getAlert(id),
            (data) => {
                setAlerts(prev => {
                    const previousIds = new Set(prev.map(a => a.id));
                    const newAlerts = data.filter(a => a.id && !previousIds.has(a.id));

                    newAlerts.forEach(a => {
                        const message = `${a.turbineId} - ${a.severity?.toUpperCase()}: ${a.message}`;

                        if (a.severity === "critical") {
                            toast.error(message, { duration: 6000 });
                        } else if (a.severity === "warning") {
                            toast(message, { icon: "⚠️", duration: 5000 });
                        } else {
                            toast(message);
                        }
                    });

                    return data;
                });
            }
        );

        return () => {
            telemetryUnsub();
            alertUnsub();
            sse.disconnect();
        };
    }, [setAlerts, setTelemetry, setWindmills]);

    return (
        <div style={{
            borderRadius: "20px",
            textAlign:"center",
            backgroundColor: "#0f172a",
            minHeight: "100vh",
            color: "white"
        }}>
            <h1>Available Wind Turbines</h1>

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
                    <div style={{ fontWeight: "bold" }}>
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