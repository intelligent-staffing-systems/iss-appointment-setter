'use client';

// src/app/signin/page.tsx
import { signIn } from 'next-auth/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle, faMicrosoft } from '@fortawesome/free-brands-svg-icons'; // Import Google and Outlook icons

export default function SignInPage() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="text-center p-8 bg-white shadow-md rounded-lg">
        <h1 className="text-3xl font-bold mb-4">Sign In</h1>
        <p className="text-lg text-gray-600 mb-6">
          Access your dashboard by signing in with your Google or Outlook account.
        </p>
        
        <button
          onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
          className="flex items-center justify-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
        >
          <FontAwesomeIcon icon={faGoogle} className="mr-2" /> {/* Google Icon */}
          Sign in with Google
        </button>

        <button
          onClick={() => signIn('outlook', { callbackUrl: '/dashboard' })}
          className="flex items-center justify-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          <FontAwesomeIcon icon={faMicrosoft} className="mr-2" /> {/* Outlook Icon */}
          Sign in with Outlook
        </button>
      </div>
    </div>
  );
}
