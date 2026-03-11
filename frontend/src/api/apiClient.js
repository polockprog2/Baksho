// frontend/src/api/apiClient.js

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

/**
 * Enhanced fetch wrapper for consistent API interaction
 */
async function apiClient(endpoint, options = {}) {
    const {
        method = 'GET',
        body,
        headers: customHeaders,
        credentials = 'include',
        ...rest
    } = options;

    const url = `${API_BASE_URL}/${endpoint.startsWith('/') ? endpoint.slice(1) : endpoint}`;

    const headers = {
        'Content-Type': 'application/json',
        ...customHeaders,
    };

    // If body is FormData, don't set Content-Type header
    if (body instanceof FormData) {
        delete headers['Content-Type'];
    }

    const config = {
        method,
        headers,
        credentials,
        ...rest,
    };

    if (body && !(body instanceof FormData)) {
        config.body = JSON.stringify(body);
    } else if (body) {
        config.body = body;
    }

    try {
        const response = await fetch(url, config);

        if (!response.ok) {
            // Attempt to parse error response
            let errorMessage = `HTTP error! status: ${response.status}`;
            try {
                const errorData = await response.json();
                errorMessage = errorData.error || errorData.message || errorMessage;
            } catch (e) {
                // Not a JSON error response
            }
            throw new Error(errorMessage);
        }

        // Return JSON for all successful responses
        return await response.json();
    } catch (error) {
        console.error(`API Call Error [${method} ${url}]:`, error.message);
        throw error;
    }
}

export default apiClient;
