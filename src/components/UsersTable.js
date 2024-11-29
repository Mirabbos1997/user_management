import React, { useState, useEffect } from 'react';
import api, { setAuthToken } from '../api/api';
import { Table, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaBan, FaCheckCircle, FaTrashAlt } from 'react-icons/fa'; // Import icons
import '../assets/UsersTable.css'; // Import the CSS file

const UsersTable = () => {
    const [users, setUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login'); // Redirect to login if no token
                return;
            }
            setAuthToken(token);

            try {
                const res = await api.get('/users');
                setUsers(res.data);
            } catch (err) {
                setErrorMessage('Failed to fetch users. Please log in again.');
                navigate('/login');
            }
        };

        fetchUsers();
    }, [navigate]);

    const handleAction = async (action) => {
        const token = localStorage.getItem('token');
        if (!token) {
            setErrorMessage('You are not logged in.');
            navigate('/login');
            return;
        }
        setAuthToken(token);

        try {
            if (action === 'delete') {
                await api.delete('/users/delete', {
                    data: { userIds: selectedUsers },
                });
                setUsers(users.filter(user => !selectedUsers.includes(user.id)));
            } else {
                await api.post(`/users/${action}`, { userIds: selectedUsers });
                const updatedUsers = users.map(user =>
                    selectedUsers.includes(user.id)
                        ? { ...user, status: action === 'block' ? 'blocked' : 'active' }
                        : user
                );
                setUsers(updatedUsers);
            }
            setSuccessMessage(`Users ${action}d successfully!`);
            setSelectedUsers([]);
        } catch (err) {
            setErrorMessage('Action failed. Please try again.');
            console.error('Action Error:', err.response || err.message);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token'); // Remove the token
        navigate('/login'); // Redirect to login page
    };

    return (
        <div className="user-management-container">
            <div className="user-management-toolbar">
                <h2 className="user-management-title">User Management</h2>
                <button className="logout-button" onClick={handleLogout}>
                    Logout
                </button>
            </div>
            {errorMessage && <Alert variant="danger" className="alert-container">{errorMessage}</Alert>}
            {successMessage && <Alert variant="success" className="alert-container">{successMessage}</Alert>}
            <div className="user-management-toolbar">
                <div className="action-buttons">
                    <button
                        className="action-button block-button"
                        onClick={() => handleAction('block')}
                        disabled={!selectedUsers.length}
                    >
                        <FaBan className="action-icon" /> Block
                    </button>
                    <button
                        className="action-button unblock-button"
                        onClick={() => handleAction('unblock')}
                        disabled={!selectedUsers.length}
                    >
                        <FaCheckCircle className="action-icon" /> Unblock
                    </button>
                    <button
                        className="action-button delete-button"
                        onClick={() => handleAction('delete')}
                        disabled={!selectedUsers.length}
                    >
                        <FaTrashAlt className="action-icon" /> Delete
                    </button>
                </div>
            </div>
            <Table className="user-management-table">
                <thead>
                    <tr>
                        <th>
                            <input
                                type="checkbox"
                                className="user-management-checkbox"
                                onChange={(e) => {
                                    const isChecked = e.target.checked;
                                    setSelectedUsers(isChecked ? users.map(user => user.id) : []);
                                }}
                                checked={selectedUsers.length === users.length}
                            />
                        </th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Status</th>
                        <th>Last Login</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td>
                                <input
                                    type="checkbox"
                                    className="user-management-checkbox"
                                    checked={selectedUsers.includes(user.id)}
                                    onChange={() => {
                                        setSelectedUsers(prev =>
                                            prev.includes(user.id)
                                                ? prev.filter(id => id !== user.id)
                                                : [...prev, user.id]
                                        );
                                    }}
                                />
                            </td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.status}</td>
                            <td>{user.last_login ? new Date(user.last_login).toLocaleString() : 'N/A'}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default UsersTable;
