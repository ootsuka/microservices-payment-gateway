
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './Login';
import Transaction from './Transaction';

import './App.css'

const App = () => {
  // Simulate checking login status (replace with actual logic)
  const isAuthenticated = () => {
    return localStorage.getItem('authToken') !== null;
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={isAuthenticated() ? <Navigate to="/transaction" /> : <Navigate to="/login" />} />
        <Route path="/login" element={isAuthenticated() ? <Navigate to="/" /> : <LoginPage />} />
        <Route path="/transaction" element={!isAuthenticated() ? <Navigate to="/login" /> : <Transaction />} />
        {/* 404 Fallback */}
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
      </Routes>
    </Router>
  );
};

export default App;
