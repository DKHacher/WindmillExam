import { useState } from "react";
import windmill from "../assets/windmill.jpg";
import WindmillInformationPage from "./WindmillInformationPage.tsx";

function WindmillContainer() {
    const [showInfo, setShowInfo] = useState(false);

    function start() {

    }

    function stop() {

    }

    return(
        <>
            <div className="windmill-graphic" onClick={() => setShowInfo(prev => !prev)} style={{ cursor: "pointer" }}>
                <img src={windmill} alt="Windmill" />
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