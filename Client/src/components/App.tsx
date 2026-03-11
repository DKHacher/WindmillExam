import Dashboard from "./Dashboard.tsx";
import '../animation.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Login.tsx";
import {Toaster} from "react-hot-toast";
import PrivateRoute from "./PrivateRoute.tsx";
import {useState} from "react";

function App() {
    const [loggedIn, setLoggedIn] = useState(false);

    return (
        <>
            <Toaster position="top-right" />

            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Login onLogin={() => setLoggedIn(true)} />} />
                    <Route
                        path="/dashboard"
                        element={
                        <PrivateRoute isAuthenticated={loggedIn}>
                            <Dashboard />
                        </PrivateRoute>
                        }
                    />
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;