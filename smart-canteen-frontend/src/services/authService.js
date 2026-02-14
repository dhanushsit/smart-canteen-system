import api from './api';

export const login = async (email, password) => {
    return api.post('/auth/login', { email, password });
};

export const register = async (name, email, phone, password) => {
    return api.post('/auth/register', { name, email, phone, password });
};

export const resetPassword = async (email, newPassword, confirmPassword) => {
    return api.post('/auth/reset-password', { email, newPassword, confirmPassword });
};

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};

export const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem('user'));
};
