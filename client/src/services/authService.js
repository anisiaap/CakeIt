
const backendHost = process.env.REACT_APP_BACKEND_HOST;

export const registerUser = async (userData) => {
    const response = await fetch(`${backendHost}/api/auth/register`, {
        method: 'POST',
        body: userData // No explicit Content-Type header
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
    }
    return data;
};
export const registerClient = async (userData) => {
    const response = await fetch(`${backendHost}/api/auth/registerClient`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
        // Include field information in the error object
        const error = new Error(data.message || 'Registration failed');
        error.response = { data };
        throw error;
    }

    return data;
};

export const checkFieldAvailability = async (field, value, role = 'bakery') => {
    try {
        const queryParams = new URLSearchParams({ field, value, role }).toString();
        const response = await fetch(`${backendHost}/api/auth/check-field?${queryParams}`);

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to check field availability');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error in checkFieldAvailability:', error);
        throw new Error('Unable to check field availability. Please try again later.');
    }
};
