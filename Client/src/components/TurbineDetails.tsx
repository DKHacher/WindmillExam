import { WindmillTelemetryEntity } from "../services/generated-ts-client.ts";
import { restClient } from "../services/sse.ts";
import { useState } from "react";
import TurbineCharts from "./TurbineCharts.tsx";

type TurbineDetailsProps = {
    turbine: WindmillTelemetryEntity;
    onClose: () => void;
};

function TurbineDetails({ turbine, onClose }: TurbineDetailsProps) {
    const statusText = turbine.status?.toUpperCase();
    const statusEmoji =
        turbine.status === "running" ? "🟢" :
            turbine.status === "stopped" ? "🔴" : "";

    const [stopReason, setStopReason] = useState<string>("");
    const [bladePitch, setBladePitch] = useState<number | undefined>();
    const [showCharts, setShowCharts] = useState(false);

    const start = () => restClient.startTurbine(turbine.turbineId);
    const stop = () => restClient.stopTurbine(turbine.turbineId, stopReason);
    const setBladePitchCommand = () => restClient.setBladePitch(turbine.turbineId, bladePitch);

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                background: "rgba(0,0,0,0.5)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "#fff",
                overflowY: "auto",
                padding: "20px",
                zIndex: 1000,
            }}
        >
            <div
                style={{
                    position: "relative",
                    background: "#333",
                    padding: "20px",
                    borderRadius: "10px",
                    width: "90%",
                    maxWidth: "900px",
                    maxHeight: "90vh",
                    overflowY: "auto",
                }}
            >

                <button
                    onClick={onClose}
                    style={{
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                        background: "#ff4d4d",
                        border: "none",
                        borderRadius: "50%",
                        color: "#fff",
                        width: "35px",
                        height: "35px",
                        cursor: "pointer",
                        fontWeight: "bold",
                        fontSize: "18px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
                    }}
                >
                    ✕
                </button>

                <h2>{turbine.turbineName} Details</h2>

                <div style={{ display: "grid", gridTemplateColumns: "150px 1fr", rowGap: "8px", columnGap: "10px", marginBottom: "20px" }}>
                    <span>Connected Farm</span> <span>{turbine.farmId}</span>
                    <span>Wind Speed</span> <span>{turbine.windSpeed}</span>
                    <span>Wind Direction</span> <span>{turbine.windDirection}</span>
                    <span>Ambient Temp</span> <span>{turbine.ambientTemperatur}</span>
                    <span>Rotor Speed</span> <span>{turbine.rotorSpeed}</span>
                    <span>Power Output</span> <span>{turbine.powerOutput}</span>
                    <span>Nacelle Direction</span> <span>{turbine.nacelleDirection}</span>
                    <span>Blade Pitch</span> <span>{turbine.bladePitch}</span>
                    <span>Generator Temp</span> <span>{turbine.generatorTemp}</span>
                    <span>Gearbox Temp</span> <span>{turbine.gearboxTemp}</span>
                    <span>Vibration</span> <span>{turbine.vibration}</span>
                    <span>Status</span> <span>{statusText} {statusEmoji}</span>
                </div>

                <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
                    <button onClick={start}>Start Turbine</button>
                </div>

                <div style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
                    <button onClick={stop}>Stop Turbine</button>
                    <input
                        type="text"
                        value={stopReason}
                        placeholder="Enter reason for stopping"
                        onChange={(e) => setStopReason(e.target.value)}
                        style={{ marginLeft: "10px" }}
                    />
                </div>

                <div style={{ marginBottom: "20px" }}>
                    <p>Adjust blade pitch</p>
                    <input
                        type="number"
                        value={bladePitch}
                        placeholder={`Current: ${turbine.bladePitch}`}
                        onChange={(e) => setBladePitch(Number(e.target.value))}
                        style={{ marginRight: "10px" }}
                    />
                    <button onClick={setBladePitchCommand}>Submit New Blade Pitch</button>
                </div>

                <button
                    onClick={() => setShowCharts(true)}
                    style={{ marginTop: "20px", padding: "10px 20px" }}
                >
                    Show Telemetry Charts
                </button>

            </div>

            {showCharts && <TurbineCharts turbineId={turbine.turbineId} onClose={() => setShowCharts(false)} />}
        </div>
    );
}

export default TurbineDetails;