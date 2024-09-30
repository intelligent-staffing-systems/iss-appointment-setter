// src/app/signin/page.tsx
'use client';

import { signIn } from 'next-auth/react';
import { FaGoogle, FaMicrosoft } from 'react-icons/fa'; // Importing Google and Microsoft icons

export default function SignInPage() {
  return (
    <div className="flex items-center justify-center h-screen" style={{ backgroundColor: 'rgb(29, 65, 101)' }}>
      <div className="p-10 bg-white shadow-md rounded-lg max-w-md w-full">

        {/* Social Sign-In Buttons */}
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
