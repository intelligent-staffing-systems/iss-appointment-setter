// src/app/api/uploadCustomers.ts

export const uploadCustomers = async (userId: string, customers: any[]) => {
    try {
      const response = await fetch('/api/customers/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          customers: customers,
        }),
      });
  
      const result = await response.json();
  
      // Check if the response status is not OK (e.g., 4xx or 5xx status codes).
      if (!response.ok) {
        return {
          status: 'Error',
          message: result.message || 'Failed to upload customers',
          errors: result.errors || [],
          duplicate_customers: result.duplicate_customers || []
        };
      }
  
      // If the response is OK, return the result as a success.
      return result;
    } catch (error: any) {
      // Safely extract the message from the error object.
      return {
        status: 'Error',
        message: error.message || 'An error occurred while uploading customers',
      };
    }
  };
  