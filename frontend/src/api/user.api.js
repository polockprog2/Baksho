import apiClient from './apiClient';

/**
 * Service to handle user and auth API calls
 */

export const loginUser = async (email, password) => {
    return await apiClient('auth/login', {
        method: 'POST',
        body: { email, password }
    });
};

export const registerUserApi = async (userData) => {
    return await apiClient('auth/register', {
        method: 'POST',
        body: userData
    });
};

export const verifyEmailApi = async (token) => {
    return await apiClient(`auth/verify?token=${encodeURIComponent(token)}`);
};

export const resendVerificationApi = async (email) => {
    return await apiClient('auth/resend-verification', {
        method: 'POST',
        body: { email }
    });
};

export const forgotPasswordApi = async (email) => {
    return await apiClient('auth/forgot-password', {
        method: 'POST',
        body: { email }
    });
};

export const resetPasswordApi = async (token, password) => {
    return await apiClient('auth/reset-password', {
        method: 'POST',
        body: { token, password }
    });
};

export const subscribeNewsletter = async (email) => {
    return await apiClient('subscribe', {
        method: 'POST',
        body: { email }
    });
};

export const getUserProfile = async (id) => {
    return await apiClient(`users/${id}`);
};

export const updateUserProfileApi = async (id, userData) => {
    return await apiClient(`users/${id}`, {
        method: 'PATCH',
        body: userData
    });
};

export const getAddresses = async (userId) => {
    return await apiClient(`users/${userId}/addresses`);
};

export const addAddressApi = async (userId, addressData) => {
    return await apiClient(`users/${userId}/addresses`, {
        method: 'POST',
        body: addressData
    });
};

export const updateAddressApi = async (userId, addressId, addressData) => {
    return await apiClient(`users/${userId}/addresses/${addressId}`, {
        method: 'PATCH',
        body: addressData
    });
};

export const deleteAddressApi = async (userId, addressId) => {
    return await apiClient(`users/${userId}/addresses/${addressId}`, {
        method: 'DELETE'
    });
};

export const getUsers = async (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.search) queryParams.append('search', params.search);

    const queryString = queryParams.toString();
    return await apiClient(`users${queryString ? '?' + queryString : ''}`);
};

export const adminUpdateUser = async (id, userData) => {
    return await apiClient(`users/${id}`, {
        method: 'PATCH',
        body: userData
    });
};

