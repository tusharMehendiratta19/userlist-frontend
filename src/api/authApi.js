import api from "./apiClient";

export const loginUser = async (email, password) => {
    return await api.post("/auth/login", { email, password });
};

export const logoutUser = async () => {
    return await api.post("/auth/logout");
};

export const changePassword = async () => {
    return await api.get("/auth/changePassword");
};

export const getLoggedInUser = async () => {
    return await api.get("/auth/getLoggedInUser");
}