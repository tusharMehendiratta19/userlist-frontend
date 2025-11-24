import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import List from './components/List';
import SignupPage from './components/SignupPage';
import UpdatePage from './components/UpdatePage';
import PasswordChange from './components/PasswordChange';
import LoginPage from './components/LoginPage';
import './App.css';

function App() {
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
          element={<List />}
        />

        <Route path="/signup" element={<SignupPage />} />

        <Route
          path="/updateDetails"
          element={<ProtectedRoute><UpdatePage /></ProtectedRoute>}
        />

        <Route
          path="/changePassword"
          element={<PasswordChange />}
        />

        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;
