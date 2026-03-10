import { useNavigate } from "react-router-dom";
import { useState } from "react";


function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = () => {
        if (username && password) {
            navigate("/dashboard");
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
            <br />
            <button onClick={goToDashboard}>Go to Dashboard</button>
        </div>
    );
}

export default Login;