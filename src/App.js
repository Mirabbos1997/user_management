import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import UsersTable from './components/UsersTable';

const App = () => {
    // Authentication state based on presence of token in localStorage
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

    // Handle user login
    const handleLogin = () => {
        setIsAuthenticated(true); // Update state to authenticated
    };

    // Handle user logout
    const handleLogout = () => {
        localStorage.removeItem('token'); // Remove token from localStorage
        setIsAuthenticated(false); // Update state to unauthenticated
    };

    return (
        <Router>
            <Routes>
                {/* Redirect root path based on authentication state */}
                <Route path="/" element={<Navigate to={isAuthenticated ? '/crud' : '/login'} />} />

                {/* Login Page Route */}
                <Route path="/login" element={<Login onLogin={handleLogin} />} />

                {/* Registration Page Route */}
                <Route path="/register" element={<Register />} />

                {/* CRUD Page (Protected Route) */}
                <Route
                    path="/crud"
                    element={
                        isAuthenticated ? (
                            <UsersTable onLogout={handleLogout} />
                        ) : (
                            <Navigate to="/login" />
                        )
                    }
                />

                {/* Fallback for any unknown route */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    );
};

export default App;
