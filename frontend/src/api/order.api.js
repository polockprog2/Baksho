import apiClient from './apiClient';

/**
 * Service to handle order API calls
 */
export const getOrders = async (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.status) queryParams.append('status', params.status);
    if (params.search) queryParams.append('search', params.search);
    if (params.userId) queryParams.append('userId', params.userId);

    const queryString = queryParams.toString();
    return await apiClient(`orders${queryString ? '?' + queryString : ''}`);
};

export const getOrderById = async (id) => {
    return await apiClient(`orders/${id}`);
};

export const createOrder = async (orderData) => {
    return await apiClient('orders', {
        method: 'POST',
        body: orderData
    });
};

export const updateOrderStatus = async (id, status) => {
    return await apiClient(`orders/${id}`, {
        method: 'PATCH',
        body: { status }
    });
};

