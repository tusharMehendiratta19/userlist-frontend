import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../style/list.css';
import SignupPage from './SignupPage';
import { useSelector, useDispatch } from "react-redux";
import { clearUserData } from "../redux/userSlice";

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

    const fetchUsers = async (skip, limit) => {
        try {
            const response = await axios.get(
                `http://localhost:5000/v1/users/getAllUsers?skip=${skip}&limit=${limit}`,
                { withCredentials: true }
            );

            if (response.status !== 200) {
                throw new Error(response.data?.message || "Failed to fetch users");
            }

            setUsers(response.data.users);
            setTotalUsers(response.data.total || 0);
            setError(""); // clear any previous error
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
            await axios.post("http://localhost:5000/v1/auth/logout", {}, { withCredentials: true });
            dispatch(clearUserData())
            navigate("/login");
        } catch (error) {
            console.error("Logout failed:", error);
            alert("Error logging out. Try again.");
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

    const deleteUser = async (userId) => {
        console.log("Deleting user with ID:", userId);
        try {
            await axios.delete(
                `http://localhost:5000/v1/users/deleteUser/${userId}`,
                { withCredentials: true }
            );
            setUsers(users.filter((user) => user._id !== userId));
        } catch (error) {
            console.error("Error deleting user:", error);
            alert("Failed to delete user. Please try again.");
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

    return (
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
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody className="user-table-body">
                        {users.map((user, index) => (
                            <tr key={user._id}>
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
                                <td>
                                    <button
                                        onClick={() =>
                                            navigate("/updateDetails", { state: { custId: user._id } })
                                        }
                                    >
                                        Edit
                                    </button>
                                    <button onClick={() => deleteUser(user._id)}>Delete</button>
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
    );
};

export default List;
