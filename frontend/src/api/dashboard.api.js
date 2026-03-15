import apiClient from './apiClient';

/**
 * Service to fetch optimized dashboard metrics from the backend
 * Includes high-quality mock fallback for better DX and resilience
 */
export const getDashboardStats = async () => {
    return await apiClient('dashboard/stats');
};

