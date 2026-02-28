const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const getHomepageSettings = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/settings/homepage`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        if (response.ok) {
            return await response.json();
        }
        return {};
    } catch (error) {
        console.error('getHomepageSettings error:', error);
        return {};
    }
};

export const updateHomepageSettings = async (settings) => {
    try {
        const response = await fetch(`${API_BASE_URL}/settings/homepage`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(settings)
        });
        if (response.ok) {
            return await response.json();
        }
        const error = await response.json();
        throw new Error(error.error || 'Failed to update settings');
    } catch (error) {
        console.error('updateHomepageSettings error:', error);
        throw error;
    }
};
