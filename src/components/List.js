import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/list.css';
import { useSelector, useDispatch } from "react-redux";
import { clearUserData } from "../redux/userSlice";
import Snackbar from './Snackbar';
import constants from '../constants';
import { logoutUser } from "../api/authApi";
import { getAllUsers, deleteUser as apiDeleteUser } from "../api/userApi";

const List = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const dispatch = useDispatch();
    const { name, loginTime } = useSelector((state) => state.user);
    const navigate = useNavigate();
    const [skip, setSkip] = useState(0);
    const [limit, setLimit] = useState(5);
    const [totalUsers, setTotalUsers] = useState(0);
    const pageNo = skip / limit + 1;
    const [snack, setSnack] = useState({ open: false, message: "", type: "" });
    let userId = sessionStorage.getItem("userId");

    const showSnack = (msg, type) => {
        setSnack({ open: true, message: msg, type });
        setTimeout(() => setSnack({ open: false, message: "", type: "" }), 3000);
    };

    const fetchUsers = async (skip, limit) => {
        try {
            const response = await getAllUsers(skip, limit);

            if (response.status !== 200) {
                throw new Error(response.data?.message || "Failed to fetch users");
            }

            setUsers(response.data.users);
            setTotalUsers(response.data.total || 0);
            setError("");
        } catch (err) {
            console.error("Error fetching users:", err);
            setError(err.response?.data?.message || "Session expired or unauthorized access");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers(skip, limit);
    }, []);

    const handleLogout = async () => {
        try {
            await logoutUser();
            dispatch(clearUserData())
            sessionStorage.removeItem("userId");
            showSnack(constants.logout_success, constants.success);
            setTimeout(() => navigate("/login"), 1000);
        } catch (error) {
            console.error("Logout failed:", error);
            showSnack(constants.login_failed, constants.error);
        }
    };

    const handleNext = (currentSkip) => {
        if (currentSkip + 5 < totalUsers) {
            setSkip(currentSkip + 5);
            fetchUsers(currentSkip + 5, limit);
        }
    };

    const handlePrevious = (currentSkip) => {
        if (currentSkip >= 5) {
            setSkip(currentSkip - 5);
            fetchUsers(currentSkip - 5, limit);
        }
    };

    const handleUpdate = (userId) => {
        console.log("userId:", userId);
        if (userId !== null) {
            navigate("/updateDetails", { state: { custId: userId } });
        }
    };

    const deleteUser = async (userId) => {
        console.log("Deleting user with ID:", userId);
        try {
            await apiDeleteUser(userId);
            showSnack(constants.user_delete_success, constants.success);
            setUsers(users.filter((user) => user.id !== userId));
            setTotalUsers(totalUsers - 1);
        } catch (error) {
            console.error("Error deleting user:", error);
            showSnack(constants.user_delete_failed, constants.error);
        }
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (error) {
        return (
            <div className="error-container">
                <h2>{error}</h2>
                <button className="login-btn" onClick={() => navigate("/login")}>
                    Go to Login
                </button>
            </div>
        );
    }

    // console.log("Users data:", users);

    return (
        <div>
            <div className="main-container">
                <div className="header">
                    <p>Login Time: {loginTime}</p>
                    <p>Logged in as: {name}</p>
                    <button onClick={handleLogout}>Log Out</button>
                </div>

                <div className="table-container">
                    <h2>User List</h2>
                    <div className="table-info">
                        <button className="add-user-btn" onClick={() => navigate("/signup")}>Add New User</button>
                        <p>Page: {pageNo}</p>
                        <p>Total Users: {totalUsers}</p>
                    </div>
                    <table border="1" className="user-table">
                        <thead>
                            <tr>
                                <th>S.No.</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Gender</th>
                                <th>Address</th>
                                <th>Area of Interest</th>
                                {/* <th>profile</th> */}
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody className="user-table-body">
                            {users.map((user, index) => (
                                <tr key={index + 1}>
                                    <td>{index + 1}</td>
                                    <td>{user.firstName} {user.lastName}</td>
                                    <td>{user.email}</td>
                                    <td>{user.gender}</td>
                                    <td>{user.city}, {user.state}, {user.country} - {user.zipcode}</td>
                                    <td>
                                        {Array.isArray(user.interest)
                                            ? user.interest.map((intr) => (
                                                <span key={intr}>{intr} </span>
                                            ))
                                            : user.interest}
                                    </td>
                                    {/* <td>
                                        <img
                                            src={user.profileImage ? `${constants.base_url}${user.profileImage}` : "/default-avatar.png"}
                                            alt="profile"
                                            style={{ width: "40px", height: "40px" }}
                                        />
                                    </td> */}

                                    <td>
                                        <button
                                            onClick={() => handleUpdate(user.id)}
                                        >
                                            Edit
                                        </button>
                                        <button onClick={() => deleteUser(user.id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className='pagination'>
                        <button className="page-btn" onClick={() => handlePrevious(skip)}>Previous</button>
                        <button className="page-btn" onClick={() => handleNext(skip)}>Next</button>
                    </div>
                </div>
            </div>
            <Snackbar open={snack.open} message={snack.message} type={snack.type} />
        </div>
    );
};

export default List;
