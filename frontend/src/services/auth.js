import api from './api';

const login = async (email, password) => {
    // Cannot use api instance here because it intercepts and we might not have a token yet,
    // actually it's fine because the token is only added if it exists.
    const response = await api.post('/login', { email, password });
    if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
};

const register = async (name, email, password, role = 'staff') => {
    const response = await api.post('/register', { name, email, password, role });
    return response.data;
};

const logout = () => {
    localStorage.removeItem('user');
};

const getCurrentUser = () => {
    const userStr = localStorage.getItem('user');
    if (userStr) return JSON.parse(userStr).user;
    return null;
};

const getToken = () => {
    const userStr = localStorage.getItem('user');
    if (userStr) return JSON.parse(userStr).token;
    return null;
};

const authService = {
    login,
    register,
    logout,
    getCurrentUser,
    getToken,
};

export default authService;
