import api from "./apiClient";

export const getAllUsers = async (skip = 0, limit = 5) => {
    return await api.get(`/users/getAllUsers?skip=${skip}&limit=${limit}`);
};

export const deleteUser = async (userId) => {
    return await api.delete(`/users/deleteUser/${userId}`);
};

export const updateUser = async (userData) => {
    return await api.post(`/users/updateUser`, userData);
};  

export const getUserById = async (userId) => {
    return await api.get(`/users/getUserData/${userId}`);
};

export const createUser = async (formData) => {
    return await api.post(`/users/register`, formData);
}

export const locationsList = async () => {
    return await api.get(`/users/locations`);
}