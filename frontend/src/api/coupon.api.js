import apiClient from './apiClient';

/**
 * Validate a coupon code and get its discount details.
 */
export const validateCoupon = async (code) => {
    return await apiClient(`coupons?code=${encodeURIComponent(code)}`);
};

/**
 * Get all coupons (admin only).
 */
export const getCoupons = async () => {
    return await apiClient('coupons');
};

/**
 * Create a coupon (admin only).
 */
export const createCoupon = async (couponData) => {
    return await apiClient('coupons', {
        method: 'POST',
        body: couponData
    });
};

/**
 * Update a coupon (admin only).
 */
export const updateCoupon = async (id, couponData) => {
    return await apiClient(`coupons/${id}`, {
        method: 'PATCH',
        body: couponData
    });
};

/**
 * Delete a coupon (admin only).
 */
export const deleteCoupon = async (id) => {
    return await apiClient(`coupons/${id}`, {
        method: 'DELETE'
    });
};
