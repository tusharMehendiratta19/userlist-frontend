import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5000/v1",
    withCredentials: true,
    timeout: 10000,
    validateStatus: (status) => {
        return status >= 200 && status < 500; // Resolve only if the status code is less than 500
    }
});

// Request Interceptor
api.interceptors.request.use(
    (config) => {
        // you can inject headers here if needed
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Token expired → try refresh token
        if (error.response?.status === 403 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                await api.get("/auth/refresh-token"); // backend should send new token cookies
                return api(originalRequest);          // retry original request
            } catch (refreshErr) {
                console.error("Refresh token failed", refreshErr);
                return Promise.reject(refreshErr);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
