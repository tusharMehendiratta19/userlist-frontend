import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import '../style/login.css';
import PasswordChange from "./PasswordChange";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showpwchange, setShowpwchange] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let resp = await axios.post(
                "http://localhost:5000/v1/auth/login",
                { email, password },
                { withCredentials: true } // important: allows cookies to be stored
            );
            if (resp.status === 200) {
                sessionStorage.setItem("custId", resp.data.userId);
                sessionStorage.setItem("name", resp.data.userName);
                sessionStorage.setItem("loginTime", new Date().toLocaleString());
                navigate("/");
            } else {
                throw new Error("Login failed");
            }
            // alert("Login successful");
        } catch (err) {
            console.error("Login failed:", err);
        }
    };

    return (
        <div>
            <div className="login-container">
                <h2>Login</h2>
                <form onSubmit={handleSubmit} className="login-form">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit" className="login-btn">Login</button>
                </form>
                <p onClick={() => navigate("/changePassword")}>Forgot Password</p>
                <p onClick={() => navigate("/signup")}>New User? <span>Sign Up</span></p>
            </div>
        </div>
    );
}

export default LoginPage;