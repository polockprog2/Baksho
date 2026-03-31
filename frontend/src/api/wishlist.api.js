import apiClient from './apiClient';

/**
 * Get the current user's wishlist.
 */
export const getWishlist = async () => {
    return await apiClient('wishlist');
};

/**
 * Add a product to the wishlist.
 */
export const addToWishlistApi = async (productId) => {
    return await apiClient('wishlist', {
        method: 'POST',
        body: { productId }
    });
};

/**
 * Remove a product from the wishlist.
 */
export const removeFromWishlistApi = async (productId) => {
    return await apiClient(`wishlist?productId=${productId}`, {
        method: 'DELETE'
    });
};
