// src/api/users.ts

interface UserData {
    email: string;
    provider: string;
    google_token?: string | null; // Optional
    outlook_token?: string | null; // Optional
}

export const createUser = async (userData: UserData) => {
    try {
        const response = await fetch('http://localhost:3001/api/users', { // Ensure this matches the backend route
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user: userData }), // Ensure the payload structure matches the backend
        });

        if (!response.ok) {
            // Handle HTTP errors
            const errorData = await response.json(); // Get any error messages from the response
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.status || 'Unknown error'}`);
        }

        const data = await response.json();
        return data; // Return the response data from the backend
    } catch (error) {
        console.error('Error creating user:', error);
        throw error; // Re-throw the error for handling in the calling function
    }
};
