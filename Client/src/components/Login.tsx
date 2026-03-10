import { useNavigate } from "react-router-dom";
import { useState } from "react";
// import { useAtom } from "jotai";
// import {jwtAtom} from "../atoms/authAtom.ts";
// import {restClient} from "../services/sse.ts";

function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    // const [, setJwt] = useAtom(jwtAtom);
    const [error, setError] = useState("");

    const handleLogin = async () => {
        if (!username || !password) return;

        try {
            // const token = await restClient.login(username, password);
            // setJwt(token);
            // sessionStorage.setItem("authToken", token);
            navigate("/dashboard");
        } catch (err) {
            setError("Login failed");
            console.error(err);
        }
    };

    const goToDashboard = () => {
        navigate("/dashboard");
    };

    return (
        <div style={{ textAlign: "center", marginTop: "100px" }}>
            <h1>Login</h1>
            <input
                placeholder="Username"
                value={username}
                onChange={e => setUsername(e.target.value)}
            />
            <br />
            <input
                placeholder="Password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
            />
            <br />
            <button onClick={handleLogin}>Login</button>
            <div>
                <button onClick={goToDashboard}>Go to Dashboard</button>
            </div>
            {error && <div style={{ color: "red" }}>{error}</div>}
        </div>
    );
}

export default Login;