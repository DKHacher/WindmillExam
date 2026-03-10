import Dashboard from "./Dashboard.tsx";
import '../animation.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Login.tsx";
// import PrivateRoute from "./PrivateRoute.tsx";

function App() {
    // const [loggedIn, setLoggedIn] = useState(false);

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;