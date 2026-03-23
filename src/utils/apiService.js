// API base URL - can be configured based on environment
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

// Default request timeout in milliseconds
const DEFAULT_TIMEOUT = 30000;

/**
 * Create a fetch request with timeout
 * @param {string} url - API endpoint
 * @param {Object} options - Fetch options
 * @param {number} timeout - Timeout in milliseconds
 * @returns {Promise} - Fetch promise with timeout
 */
const fetchWithTimeout = (url, options, timeout = DEFAULT_TIMEOUT) => {
    return Promise.race([
        fetch(url, options),
        new Promise((_, reject) =>
            setTimeout(() => reject(new Error(`Request timed out after ${timeout}ms`)), timeout)
        )
    ]);
};

/**
 * Fetch user's test results
 * @param {string} userId - User ID
 * @returns {Promise<Object[]>} - Test results data
 */
export const fetchTestResults = async (userId) => {
    try {
        const response = await fetchWithTimeout(`${API_BASE_URL}/test-results/${userId}`);

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new Error(
                errorData?.message || `Error ${response.status}: ${response.statusText}`
            );
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching test results:', error);

        // Return empty array as fallback instead of throwing error
        // This helps the UI display gracefully even when API fails
        return [];
    }
};

/**
 * Save user's test results
 * @param {string} userId - User ID
 * @param {Object} results - Test results to save
 * @returns {Promise<Object>} - Saved test result data
 */
export const saveTestResults = async (userId, results) => {
    try {
        const response = await fetchWithTimeout(
            `${API_BASE_URL}/test-results/${userId}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(results),
            }
        );

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new Error(
                errorData?.message || `Error ${response.status}: ${response.statusText}`
            );
        }

        return await response.json();
    } catch (error) {
        console.error('Error saving test results:', error);

        // Return the original results to allow UI to continue
        // with localStorage fallback
        localStorage.setItem(`test_results_${userId}_${Date.now()}`, JSON.stringify(results));
        return results;
    }
};

/**
 * Authenticate user (login)
 * @param {Object} credentials - User login credentials
 * @returns {Promise<Object>} - User data with auth token
 */
export const loginUser = async (credentials) => {
    try {
        const response = await fetchWithTimeout(
            `${API_BASE_URL}/auth/login`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials),
            }
        );

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new Error(
                errorData?.message || `Error ${response.status}: ${response.statusText}`
            );
        }

        const userData = await response.json();
        // Store auth token in local storage for persistent sessions
        if (userData.token) {
            localStorage.setItem('authToken', userData.token);
        }

        return userData;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
};

/**
 * Get authorized request headers with auth token
 * @returns {Object} - Headers object with Authorization
 */
export const getAuthHeaders = () => {
    const token = localStorage.getItem('authToken');
    return {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
    };
};

/**
 * Health check to verify API connectivity
 * @returns {Promise<boolean>} - True if API is reachable
 */
export const checkApiHealth = async () => {
    try {
        const response = await fetchWithTimeout(`${API_BASE_URL}/health`, {}, 5000);
        return response.ok;
    } catch (error) {
        console.warn('API health check failed:', error);
        return false;
    }
};