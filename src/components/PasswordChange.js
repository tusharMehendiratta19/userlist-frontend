import { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../style/pwchange.css';
import Snackbar from "./Snackbar";
import constants from '../constants';
import { changePassword } from "../api/authApi";

const PasswordChange = () => {
    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const navigate = useNavigate();
    const [snack, setSnack] = useState({ open: false, message: "", type: "" });

    const showSnack = (msg, type) => {
        setSnack({ open: true, message: msg, type });
        setTimeout(() => setSnack({ open: false, message: "", type: "" }), 3000);
    };
    // let custId = props.custId;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmNewPassword) {
            showSnack(constants.password_mismatch, constants.error);
            return;
        }
        try {
            let pwChange = await changePassword(email, newPassword);
            if (pwChange.status === 200) {
                showSnack(constants.password_change_success, constants.success);
                setTimeout(() => navigate("/login"), 1000);
            } else if (pwChange.status === 400) {
                showSnack(pwChange.data.message, "error");
            } else {
                showSnack(constants.password_change_failed, constants.error);
            }
        } catch (error) {
            console.error("Error changing password:", error);
            showSnack(constants.password_change_failed, constants.error);
        }
    };

    return (
        <div>
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
                        <button type="button" className="close-btn" onClick={() => navigate("/login")}>Cancel</button>
                    </div>
                </form>
            </div>
            <Snackbar open={snack.open} message={snack.message} type={snack.type} />
        </div>
    );
};

export default PasswordChange;
