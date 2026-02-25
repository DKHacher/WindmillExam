import { createContext, useContext } from "react";
import { MqttClient } from "mqtt";

type MqttContextType = {
    mqttClient: MqttClient | null;
}

export const MqttContext = createContext<MqttContextType>({
    mqttClient: null
});

export const useMqtt = () => useContext(MqttContext);