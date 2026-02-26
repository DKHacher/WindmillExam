import {FC} from "react";

type WindTurbineProps = {
   windSpeed: number,
   status?: "OK"|"WARNING"|"ERROR";
 };

const WindTurbine: FC<WindTurbineProps> = ({
    windSpeed,
    status = "OK",
}) => {
    const duration = Math.max(0.5, 6 - windSpeed /5);

    const getBladeColor = () => {
        switch (status) {
            case "ERROR":
                return "#ff4d4d";
            case "WARNING":
                return "#ffcc00";
            default:
                return "#ffffff";
        }
    };

    return (
        <div style={containerStyle}>
            <div
            className="rotate-center"
            style={{
                ...bladeContainerStyle,
                animationDuration: `${duration}s`,
            }}
            >
                <div style={{ ...bladeStyle, backgroundColor: getBladeColor(), transform:"rotate(0deg)" }}/>
                <div style={{ ...bladeStyle, backgroundColor: getBladeColor(), transform:"rotate(120deg)" }}/>
                <div style={{ ...bladeStyle, backgroundColor: getBladeColor(), transform:"rotate(240deg)" }}/>
            </div>

            <div style={towerStyle} />
        </div>
    );
};

export default WindTurbine;

const containerStyle: React.CSSProperties = {
    position: "relative",
    width: "200px",
    height: "300px",
    margin: "50px auto",
};

const towerStyle: React.CSSProperties = {
    width: "20px",
    height: "200px",
    background:"#ccc",
    position: "absolute",
    bottom: 0,
    left: "50%",
    transform: "translateX(-50%)",
};

const bladeContainerStyle: React.CSSProperties = {
    width: "120px",
    height: "120px",
    position: "absolute",
    top:"40px",
    left: "50%",
    transform: "translateX(-50%)",
};

const bladeStyle: React.CSSProperties = {
    width:"10px",
    height: "60px",
    position:"absolute",
    left: "50%",
    top: 0,
    transformOrigin: "bottom center",
};