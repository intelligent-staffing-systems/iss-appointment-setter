// src/app/signin/page.tsx
'use client';

import { signIn, useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { FaGoogle, FaMicrosoft } from 'react-icons/fa'; // Importing Google and Microsoft icons
import { createUser } from '../api/users'; // Import the createUser function

export default function SignInPage() {
  const { data: session } = useSession();

  // Effect to send token to the backend when the session is established
  useEffect(() => {
    const sendUserData = async () => {
      if (session?.accessToken && session?.user?.email) {
        const provider = session?.user?.email.includes('outlook.com') ? 'azure-ad' : 'google';
        
        try {
          const userData = {
            email: session.user.email,
            provider,
            google_token: provider === 'google' ? session.accessToken : null,
            outlook_token: provider === 'azure-ad' ? session.accessToken : null
          };
          
          const response = await createUser(userData); // Call createUser function
          console.log('User created or exists:', response);
        } catch (error) {
          console.error('Failed to create user:', error);
        }
      }
    };

    sendUserData(); // Call the async function
  }, [session]);

  return (
    <div className="flex items-center justify-center h-screen" style={{ backgroundColor: 'rgb(29, 65, 101)' }}>
      <div className="p-10 bg-white shadow-md rounded-lg max-w-md w-full">
        <h2 className="text-lg font-medium mb-6 text-center">Sign in with your social account</h2>

        <button
          onClick={() => signIn('azure-ad', { callbackUrl: '/dashboard' })}
          className="custom-btn flex items-center justify-center bg-gray-100 border border-gray-300 text-black font-bold py-2 px-4 rounded mb-4 w-full"
        >
          <FaMicrosoft className="mr-2" /> {/* Microsoft Icon */}
          Microsoft
        </button>

        <button
          onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
          className="custom-btn flex items-center justify-center bg-gray-100 border border-gray-300 text-black font-bold py-2 px-4 rounded w-full"
        >
          <FaGoogle className="mr-2" /> {/* Google Icon */}
          Google
        </button>

      </div>
    </div>
  );
}
