import { useState } from "react";
import windmill from "../assets/windmill.jpg";
import WindmillInformationPage from "./WindmillInformationPage.tsx";
import {useMqtt} from "../contexts/MqttContext.tsx";
import {telemetryAtom} from "../atoms/telemetryAtom.ts";
import {useAtom} from "jotai";
import {turbineTelemetryAtom} from "../atoms/turbineTelemetryAtom.ts";

type Props = {
    turbineId: string;
}

function WindmillContainer({ turbineId }: Props) {
    const [showInfo, setShowInfo] = useState(false);
    const [telemetry] = useAtom(telemetryAtom);
    const { mqttClient } = useMqtt();
    const [, setTurbineTelemetry] = useAtom(turbineTelemetryAtom);

    function start() {
        mqttClient?.publish(`farm/#/windmill/${turbineId}/command`, JSON.stringify({
            action: "start"
        }));
    }

    function stop() {
        mqttClient?.publish(`farm/#/windmill/${turbineId}/command`, JSON.stringify({
            action: "stop",
            reason: "maintenance"
        }))
    }

    return(
        <>
            <div
                className="windmill-graphic"
                onClick={() => {
                    setTurbineTelemetry(telemetry.filter(t => t.turbineId === turbineId))
                    setShowInfo(prev => !prev);
                }}
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