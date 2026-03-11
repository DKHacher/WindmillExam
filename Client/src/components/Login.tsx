import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAtom } from "jotai";
import { jwtAtom } from "../atoms/authAtom.ts";
import { authClient } from "../services/sse.ts";

type LoginProps = {
    onLogin?: () => void;
}

function Login({ onLogin }: LoginProps) {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [, setJwt] = useAtom(jwtAtom);
    const [error, setError] = useState("");

    const handleLogin = async () => {
        if (!email || !password) return;

        try {
            const result = await authClient.login({ email, password });
            if (!result.token) throw new Error("No token returned");

            setJwt(result.token);
            sessionStorage.setItem("authToken", result.token);

            onLogin?.();
            navigate("/dashboard");
        } catch (err) {
            setError("Login failed");
            console.error(err);
        }
    };

    return (
        <div style={{
            borderRadius: "20px",
            textAlign:"center",
            backgroundColor: "#0f172a",
            minHeight: "100vh",
            color: "white"
        }}>
            <h1 style={{ color: "#ffffff"}}>Login</h1>
            <input
                style={{ marginBottom: "1rem" }}
                placeholder="Email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
            />
            <br />
            <input
                style={{ marginBottom: "1rem" }}
                placeholder="Password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
            />
            <br />
            <button onClick={handleLogin}>Login</button>
            {error && <div style={{ color: "red" }}>{error}</div>}
        </div>
    );
}

export default Login;