import {WindmillTelemetryEntity} from "../services/generated-ts-client.ts";

type Props = {
    turbine: WindmillTelemetryEntity;
    onClick: () => void;
};

function WindTurbine({ turbine, onClick }: Props) {
    const duration = Math.max(0.5, 6 - (turbine.windSpeed ?? 0) /5);
    const isRunning = turbine.status === "running";

    return (
        <div style={containerStyle} onClick={onClick}>
            <div style={towerStyle} />
            <div
                className={isRunning ? "rotate-center" : undefined}
                style={{ ...bladeContainerStyle, animationDuration: `${duration}s` }}
            >
                <div style={{ ...bladeStyle, transform: "rotate(0deg)" }} />
                <div style={{ ...bladeStyle, transform: "rotate(120deg)" }} />
                <div style={{ ...bladeStyle, transform: "rotate(240deg)" }} />
            </div>
        </div>
    );
};

export default WindTurbine;

const containerStyle: React.CSSProperties = {
    cursor: "pointer",
    position: "relative",
    width: "200px",
    height: "300px",
    margin: "50px auto",
};

const towerStyle: React.CSSProperties = {
    width: "10px",
    height: "200px",
    background:"#ccc",
    position: "absolute",
    bottom: 0,
    left: "50%",
    transform: "translateX(-50%)",
};

const hubSize = 120;
const bladeLength = 80;

const bladeContainerStyle: React.CSSProperties = {
    width: `${hubSize}px`,
    height: `${hubSize}px`,
    position: "absolute",
    top: "40px",
    left: "50%",
    transform: "translateX(-50%)",
    transformOrigin: "center center",
};

const bladeStyle: React.CSSProperties = {
    width: "10px",
    height: `${bladeLength}px`,
    backgroundColor: "#ffffff",
    position: "absolute",
    top: `${hubSize / 2 - bladeLength}px`,
    left: `${hubSize / 2 - 5}px`,
    transformOrigin: "bottom center",
    clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
};