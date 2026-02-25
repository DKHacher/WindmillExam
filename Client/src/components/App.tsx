import { useEffect, useRef, useState } from "react";
import mqtt from "mqtt";
import WindmillContainer from "./WindmillContainer.tsx";
import { useAtom } from "jotai";
import { telemetryAtom } from "../atoms/telemetryAtom.ts";
import { MqttContext } from "../contexts/MqttContext";

function App() {
    const BROKER_URL = "wss://broker.hivemq.com:8884/mqtt";
    const clientRef = useRef<mqtt.MqttClient | null>(null);
    const [, setTelemetry] = useAtom(telemetryAtom);
    const [turbineIds, setTurbineIds] = useState<string[]>([]);

    useEffect(() => {
        clientRef.current = mqtt.connect(BROKER_URL, {
            clean: true,
            connectTimeout: 5000,
        });

        clientRef.current.on("connect", () => {
            console.log("mqtt connected");
            clientRef.current?.subscribe("turbine/telemetry/#", (err) => {
                if (err) console.error("subscription error:", err);
            });
        });

        clientRef.current.on("error", (err) => console.error("MQTT error:", err));
        clientRef.current.on("close", () => console.log("mqtt connection closed"));

        clientRef.current.on("message", (_topic, message) => {
            try {
                const data = JSON.parse(message.toString());
                data.timestamp = new Date(data.timestamp);
                setTelemetry((prev) => [...prev, data]);

                setTurbineIds((prevIds) => {
                    if (!prevIds.includes(data.turbineId)) {
                        return [...prevIds, data.turbineId];
                    }
                    return prevIds;
                });
            } catch (err) {
                console.error("failed to parse telemetry:", err);
            }
        });

        return () => {
            if (clientRef.current) clientRef.current.end();
        };
    }, []);

    return (
        <MqttContext.Provider value={{ mqttClient: clientRef.current }}>
            <div>
                {turbineIds.map((id) => (
                    <WindmillContainer key={id} turbineId={id} />
                ))}
            </div>
        </MqttContext.Provider>
    );
}

export default App;