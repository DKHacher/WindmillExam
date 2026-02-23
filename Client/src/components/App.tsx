import {useEffect} from "react";
import WindmillContainer from "./WindmillContainer.tsx";

function App() {

    useEffect(() => {

    }, []);

  return (
    <>
        <div className="windmill-graphic">
            <WindmillContainer />
        </div>
    </>
  )
}

export default App
