import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import List from './components/List';
import SignupPage from './components/SignupPage';
import UpdatePage from './components/UpdatePage';
import PasswordChange from './components/PasswordChange';
import LoginPage from './components/LoginPage';
import './App.css';
import { useSelector } from 'react-redux';

function App() {
  const { userId } = useSelector((state) => state.user);

  const isAuthenticated = () => {
    return !!userId;
  };

  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated()) {
      window.location.replace('/login');
      return null;
    }
    return children;
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<ProtectedRoute><List /></ProtectedRoute>} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/updateDetails" element={<ProtectedRoute><UpdatePage /></ProtectedRoute>} />
        <Route path="/changePassword" element={<ProtectedRoute><PasswordChange /></ProtectedRoute>} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;
