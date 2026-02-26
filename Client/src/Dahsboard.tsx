import {useState} from "react";
import WindTurbine from "./WindTurbine.tsx";

const Dashboard : React.FC = () => {
    const [windSpeed, setWindSpeed] = useState<number>(15);

    return (
        <div style={{ textAlign:"center" }}>
            <h1>Windmill Dashboard</h1>

            <WindTurbine windSpeed={windSpeed} status="OK" />

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