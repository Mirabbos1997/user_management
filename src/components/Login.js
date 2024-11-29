import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { setAuthToken } from '../api/api';

const Login = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await api.post('/users/login', { email, password });
            localStorage.setItem('token', res.data.token); // Save token
            setAuthToken(res.data.token); // Set token for future requests
            onLogin(); // Update authentication state
            navigate('/crud'); // Redirect to dashboard
        } catch (err) {
            if (err.response) {
                // Handle specific errors from the backend
                if (err.response.status === 403) {
                    setError('Your account is blocked. Please contact support.');
                } else if (err.response.status === 401) {
                    setError('Invalid email or password.');
                } else {
                    setError('An error occurred. Please try again.');
                }
            } else {
                setError('Unable to connect to the server. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container" style={styles.container}>
            <form onSubmit={handleLogin} style={styles.form}>
                <h2 style={styles.title}>Login</h2>
                {error && <p style={styles.error}>{error}</p>}
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={styles.input}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={styles.input}
                    required
                />
                <button type="submit" style={styles.button} disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                </button>
                <button
                    type="button"
                    style={{ ...styles.button, backgroundColor: '#6c757d', marginTop: '10px' }}
                    onClick={() => navigate('/register')}
                >
                    Register
                </button>
            </form>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: '#f4f4f9',
    },
    form: {
        background: '#fff',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
        width: '300px',
    },
    title: {
        marginBottom: '15px',
        fontSize: '24px',
        color: '#333',
    },
    input: {
        width: '100%',
        padding: '10px',
        margin: '10px 0',
        borderRadius: '4px',
        border: '1px solid #ddd',
    },
    button: {
        width: '100%',
        padding: '10px',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    error: {
        color: 'red',
        marginBottom: '10px',
    },
};

export default Login;
