import apiClient from './apiClient';

/**
 * Service to handle product API calls
 */
export const getProducts = async (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.search) queryParams.append('search', params.search);
    if (params.category) queryParams.append('category', params.category);
    if (params.featured) queryParams.append('featured', params.featured);
    if (params.discount) queryParams.append('discount', params.discount);
    if (params.sort) queryParams.append('sort', params.sort);

    const queryString = queryParams.toString();
    return await apiClient(`products${queryString ? '?' + queryString : ''}`);
};

export const getProductById = async (id) => {
    return await apiClient(`products/${id}`);
};

export const createProduct = async (productData) => {
    return await apiClient('products', {
        method: 'POST',
        body: productData
    });
};

export const getCategories = async () => {
    return await apiClient('categories');
};

export const updateProduct = async (id, productData) => {
    return await apiClient(`products/${id}`, {
        method: 'PATCH',
        body: productData
    });
};

export const deleteProduct = async (id) => {
    return await apiClient(`products/${id}`, {
        method: 'DELETE'
    });
};

export const createCategory = async (categoryData) => {
    return await apiClient('categories', {
        method: 'POST',
        body: categoryData
    });
};

export const updateCategory = async (id, categoryData) => {
    return await apiClient(`categories/${id}`, {
        method: 'PATCH',
        body: categoryData
    });
};

export const deleteCategory = async (id) => {
    return await apiClient(`categories/${id}`, {
        method: 'DELETE'
    });
};

export const adjustStock = async (productId, amount) => {
    return await apiClient('products/inventory', {
        method: 'POST',
        body: { action: 'adjust', productIds: [productId], amount }
    });
};

export const restockLowItems = async () => {
    return await apiClient('products/inventory', {
        method: 'POST',
        body: { action: 'restock-low' }
    });
};

export const bulkUploadProducts = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    return await apiClient('products/bulk', {
        method: 'POST',
        body: formData
    });
};

// ===== REVIEW APIs =====

export const getProductReviews = async (productId, page = 1, limit = 5) => {
    return await apiClient(`reviews?productId=${productId}&page=${page}&limit=${limit}`);
};

export const createReview = async (reviewData) => {
    return await apiClient('reviews', {
        method: 'POST',
        body: reviewData
    });
};

export const deleteReview = async (reviewId) => {
    return await apiClient(`reviews?id=${reviewId}`, {
        method: 'DELETE'
    });
};
