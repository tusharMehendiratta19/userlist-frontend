import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import '../style/pwchange.css';

const PasswordChange = () => {
    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const navigate = useNavigate();
    // let custId = props.custId;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmNewPassword) {
            alert("New passwords do not match!");
            return;
        }
        try {
            await axios.post("http://localhost:5000/v1/auth/changePassword", {
                email,
                newPassword,
            });
            alert("Password changed successfully!");
            navigate("/login");
        } catch (error) {
            console.error("Error changing password:", error);
            alert("Failed to change password. Please try again.");
        }
    };

    return (
        <div className="passwordchange-container">
            <h2>Change Password</h2>
            <form onSubmit={handleSubmit} className="passwordchange-form">
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Confirm New Password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    required
                />
                <div className="action-buttons">
                    <button type="submit" className="submit-btn">Change Password</button>
                    <button type="button" className="close-btn" onClick={()=>navigate("/login")}>Cancel</button>
                </div>
            </form>
        </div>
    );
};

export default PasswordChange;
