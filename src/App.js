import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import List from './components/List';
import SignupPage from './components/SignupPage';
import UpdatePage from './components/UpdatePage';
import PasswordChange from './components/PasswordChange';
import LoginPage from './components/LoginPage';
import './App.css';

import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setUserData, clearUserData } from './redux/userSlice';
import { useEffect } from 'react';

function App() {
  const dispatch = useDispatch();
  // const userId = useSelector((state) => state.user.userId);

  const loadUser = async () => {
    try {
      const resp = await axios.get(
        "http://localhost:5000/v1/auth/getLoggedInUser",
        { withCredentials: true }
      );

      dispatch(setUserData({
        userId: resp.data.userId,
        name: resp.data.name,
        loginTime: new Date().toLocaleString()
      }));
    } catch (err) {
      dispatch(clearUserData());
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const userId = sessionStorage.getItem("userId");
  console.log("ProtectedRoute userId:", userId);

  const ProtectedRoute = ({ children }) => {
    if (!userId) {
      window.location.replace('/login');
      return null;
    }
    return children;
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<ProtectedRoute><List /></ProtectedRoute>}
        />

        <Route path="/signup" element={<SignupPage />} />

        <Route
          path="/updateDetails"
          element={<ProtectedRoute><UpdatePage /></ProtectedRoute>}
        />

        <Route
          path="/changePassword"
          element={<ProtectedRoute><PasswordChange /></ProtectedRoute>}
        />

        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;
