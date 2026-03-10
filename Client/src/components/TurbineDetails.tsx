import {WindmillTelemetryEntity} from "../services/generated-ts-client.ts";
import {restClient} from "../services/sse.ts";
import {useState} from "react";

type TurbineDetailsProps = {
    turbine: WindmillTelemetryEntity;
    onClose: () => void;
};

function TurbineDetails({ turbine, onClose }: TurbineDetailsProps) {

    const [stopReason, setStopReason] = useState<string>("");
    const [bladePitch, setBladePitch] = useState<number | undefined>();
    const statusText = turbine.status?.toUpperCase();
    const statusEmoji =
        turbine.status === "running" ? "🟢" :
            turbine.status === "stopped" ? "🔴" : "";

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
            }}
        >
            <div style={closeButtonStyle} onClick={onClose}>
                ✕
            </div>
            <div style={{ background: "#333", padding: "20px", borderRadius: "10px" }}>
                <h2>Turbine Details</h2>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "150px 1fr",
                        rowGap: "8px",
                        columnGap: "10px",
                        justifyContent: "center",
                        textAlign: "left",
                        marginBottom: "20px"
                    }}
                >
                    <span>Name</span> <span>{turbine.turbineName}</span>
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

                <div style={{ marginBottom: "10px", display: "flex", alignItems: "center" }}>
                    <button onClick={start}>Start Turbine</button>
                </div>

                <div style={{ display: "flex", alignItems: "center" }}>
                    <button onClick={stop}>Stop Turbine</button>
                    <input
                        type="text"
                        value={stopReason}
                        placeholder="Enter reason for stopping"
                        onChange={(e) => setStopReason(e.target.value)}
                        style={{ marginLeft: "10px" }}
                    />
                </div>

                <div>
                    <p>Adjust blade pitch</p>
                    <input
                        type="string"
                        value={bladePitch}
                        placeholder={`Current: ${turbine.bladePitch}`}
                        onChange={(e) => setBladePitch(Number(e.target.value))}
                        style={{ marginRight: "10px" }}
                    />
                    <button onClick={setBladePitchCommand}>Sumbit New Blade Pitch</button>
                </div>
            </div>
        </div>
    );
}

export default TurbineDetails;

const closeButtonStyle: React.CSSProperties = {
    position: "absolute",
    top: "10px",
    right: "10px",
    cursor: "pointer",
    fontWeight: "bold",
};