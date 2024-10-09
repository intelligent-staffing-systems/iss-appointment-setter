// src/api/users.ts

interface UserData {
  email: string;
  provider: string;
  google_token?: string | null; // Optional
  outlook_token?: string | null; // Optional
}

export const createUser = async (userData: UserData) => {
    try {
      const response = await fetch('http://iss-appointment-setter-backend-1:3000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user: userData }),
      });
  
      if (!response.ok) {
        let errorMessage = 'Unknown error';
        try {
          const errorData = await response.json();
          errorMessage = errorData.status || errorData.message || errorMessage;
        } catch (jsonError) {
          console.error('Error parsing JSON error response:', jsonError);
        }
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorMessage}`);
      }
  
      const data = await response.json();
      return data; // Make sure this includes the user ID, e.g., { user: { id: '...', ... } }
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  };
  