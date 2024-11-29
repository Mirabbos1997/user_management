import axios from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000', // Fallback URL
});

export const setAuthToken = (token) => {
    if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common['Authorization'];
    }
};

// No redirect logic here; the response is sent back for the component to handle
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Reject errors so components can handle them
        return Promise.reject(error);
    }
);

export default api;
