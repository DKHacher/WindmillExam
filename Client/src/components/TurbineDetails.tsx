import {WindmillTelemetryEntity} from "../services/generated-ts-client.ts";
import {restClient} from "../services/sse.ts";
import {useState} from "react";

type TurbineDetailsProps = {
    turbine: WindmillTelemetryEntity
    onClose: () => void;
};

function TurbineDetails({ turbine, onClose }: TurbineDetailsProps) {

    const [stopReason, setStopReason] = useState<string>("");
    const [bladePitch, setBladePitch] = useState<number | undefined>();

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
                <p>Name - {turbine.turbineName}</p>
                <p>Connected Farm - {turbine.farmId}</p>
                <p>Wind Speed - {turbine.windSpeed}</p>
                <p>Wind Direction - {turbine.windDirection}</p>
                <p>Ambient Temperature - {turbine.ambientTemperatur}</p>
                <p>Rotor Speed - {turbine.rotorSpeed}</p>
                <p>Power Output - {turbine.powerOutput}</p>
                <p>Nacelle Direction - {turbine.nacelleDirection}</p>
                <p>Blade Pitch - {turbine.bladePitch}</p>
                <p>Generator Temperature - {turbine.generatorTemp}</p>
                <p>Gearbox Temperature - {turbine.gearboxTemp}</p>
                <p>Vibration - {turbine.vibration}</p>
                <p>Status - {turbine.status}</p>
            </div>
            <button onClick={start}>Start Turbine</button>
            <button onClick={stop}>Stop Turbine</button>
            <input
                type="text"
                value={stopReason}
                placeholder="Enter reason for stopping"
                onChange={(e) => setStopReason(e.target.value)}
            />
            <p>Adjust blade pitch</p>
            <button onClick={setBladePitchCommand}></button>
            <input
                type="number"
                value={bladePitch}
                placeholder="Enter new blade pitch"
                onChange={(e) => setBladePitch(Number(e.target.value))}
            />
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