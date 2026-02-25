import { useState } from "react";
import windmill from "../assets/windmill.jpg";
import WindmillInformationPage from "./WindmillInformationPage.tsx";
// import { useAtom } from "jotai";
// import { telemetryAtom } from "../atoms/telemetryAtom.ts";
import {useMqtt} from "../contexts/MqttContext.tsx";

type Props = {
    turbineId: string;
}

function WindmillContainer({ turbineId }: Props) {
    const [showInfo, setShowInfo] = useState(false);
    // const [telemetry] = useAtom(telemetryAtom);
    const { mqttClient } = useMqtt();

    // const turbineTelemetry = telemetry.filter(t => t.turbineId === turbineId)

    function start() {
        mqttClient?.publish(`turbine/control/${turbineId}`, JSON.stringify({
            action: "start"
        }));
    }

    function stop() {
        mqttClient?.publish(`turbine/control/${turbineId}`, JSON.stringify({
            action: "stop",
            reason: "maintenance"
        }))
    }

    return(
        <>
            <div
                className="windmill-graphic"
                onClick={() => setShowInfo(prev => !prev)}
                style={{ cursor: "pointer" }}
            >
                <img src={windmill} alt="Windmill" />
                <h3>{turbineId}</h3>
            </div>
            {showInfo && <WindmillInformationPage />}

            <div>
                <button onClick={start}>Start</button>
                <button onClick={stop}>Stop</button>
            </div>
        </>
    )
}

export default WindmillContainer;