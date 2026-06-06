import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor: Attach JWT Token from localStorage
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor: Handle Token Expiration (401)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Token is expired, invalid, or missing
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            
            const currentPath = window.location.pathname;
            
            // Redirect to the appropriate portal login page
            if (currentPath.startsWith('/admin')) {
                if (!currentPath.includes('/admin/login')) {
                    window.location.href = '/admin/login?expired=true';
                }
            } else if (currentPath.startsWith('/recruiter')) {
                if (!currentPath.includes('/recruiter/login')) {
                    window.location.href = '/recruiter/login?expired=true';
                }
            } else {
                if (!currentPath.includes('/login')) {
                    window.location.href = '/login?expired=true';
                }
            }
        }
        return Promise.reject(error);
    }
);

export default api;
