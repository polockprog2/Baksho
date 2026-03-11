import apiClient from './apiClient';

export const getHomepageSettings = async () => {
    try {
        return await apiClient('settings/homepage');
    } catch (error) {
        console.error('getHomepageSettings error:', error);
        return {};
    }
};

export const updateHomepageSettings = async (settings) => {
    return await apiClient('settings/homepage', {
        method: 'PUT',
        body: settings
    });
};

