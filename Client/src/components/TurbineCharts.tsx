import { WindmillTelemetryEntity } from "../services/generated-ts-client.ts";
import { useAtom } from "jotai";
import { telemetryAtom } from "../atoms/telemetryAtom.ts";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from "recharts";

type TurbineChartsProps = {
    turbineId?: string;
    onClose: () => void;
};

const chartStyle = { width: "100%", height: 250 };

function TurbineCharts({ turbineId, onClose }: TurbineChartsProps) {
    const [telemetry] = useAtom(telemetryAtom);
    const turbineTelemetry = telemetry.filter(t => t.turbineId === turbineId);

    const renderLineChart = (dataKey: keyof WindmillTelemetryEntity, color: string, name?: string) => (
        <div style={chartStyle}>
            <ResponsiveContainer>
                <LineChart data={turbineTelemetry} margin={{ top: 20, right: 20, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="timestamp" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey={dataKey} stroke={color} name={name || dataKey} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );

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
                    width: "95%",
                    maxWidth: "1200px",
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

                <h2 style={{ marginBottom: "20px" }}>Telemetry Charts</h2>
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                        gap: "20px",
                    }}
                >
                    {renderLineChart("windSpeed", "#1f77b4", "Wind Speed")}
                    {renderLineChart("rotorSpeed", "#ff7f0e", "Rotor Speed")}
                    {renderLineChart("powerOutput", "#2ca02c", "Power Output")}
                    {renderLineChart("ambientTemperatur", "#d62728", "Ambient Temp")}
                    {renderLineChart("generatorTemp", "#9467bd", "Generator Temp")}
                    {renderLineChart("gearboxTemp", "#8c564b", "Gearbox Temp")}
                    {renderLineChart("bladePitch", "#e377c2", "Blade Pitch")}
                    {renderLineChart("vibration", "#7f7f7f", "Vibration")}
                </div>
            </div>
        </div>
    );
}

export default TurbineCharts;