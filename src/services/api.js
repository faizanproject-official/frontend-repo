import axios from 'axios';

// Prefer environment-based configuration, fall back to local dev API
const baseURL =
    process.env.REACT_APP_API_BASE_URL ||
    'http://127.0.0.1:8000/api';

const api = axios.create({
    baseURL,
    withCredentials: false,
    headers: {
        'Accept': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    let token = null;

    // Context-aware token retrieval to prevent stale token conflicts
    if (window.location.pathname.startsWith('/admin')) {
        token = sessionStorage.getItem('token');
        if (!token) token = localStorage.getItem('token');
    } else {
        token = localStorage.getItem('token');
        if (!token) token = sessionStorage.getItem('token');
    }

    if (token && token !== 'null' && token !== 'undefined') {
        const cleanToken = token.replace(/^"|"$/g, '');
        config.headers.Authorization = `Bearer ${cleanToken}`;
    } else {
        // Only warn for non-public routes
        if (!config.url.includes('/login') && !config.url.includes('/signup') && !config.url.includes('/register')) {
            console.warn("No token found in storage for request:", config.url);
        }
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Auto-logout on 401 Unauthorized
            localStorage.removeItem('token');
            localStorage.removeItem('isAdmin');
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('isAdmin');

            // Prevent infinite redirect loop if already on login
            if (!window.location.pathname.includes('/login')) {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
