import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../style/login.css";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";
import Snackbar from "./Snackbar";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [snack, setSnack] = useState({ open: false, message: "", type: "" });

    const showSnack = (msg, type) => {
        setSnack({ open: true, message: msg, type });
        setTimeout(() => setSnack({ open: false, message: "", type: "" }), 3000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const resp = await axios.post(
                "http://localhost:5000/v1/auth/login",
                { email, password },
                { validateStatus: () => true }
            );

            console.log("Login response:", resp.status);

            if (resp.status === 200) {
                dispatch(setUserData({
                    userId: resp.data.userId,
                    name: resp.data.userName
                }));
                showSnack("Login successful", "success");
                setTimeout(() => navigate("/"), 1000);
            } else if (resp.status === 401) {
                showSnack(resp.data.message, "error");
            } else if (resp.status === 404) {
                showSnack("User not found. Please sign up first.", "error");
            } else {
                showSnack("Login failed. Please check your credentials.", "error");
            }

        } catch (err) {
            console.error("Unexpected login error:", err);
            showSnack("Server error during login.", "error");
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
                <p onClick={() => navigate("/signup")}>
                    New User? <span>Sign Up</span>
                </p>
            </div>
            <Snackbar open={snack.open} message={snack.message} type={snack.type} />
        </div>
    );
};

export default LoginPage;
