// src/components/SignOutButton.tsx
'use client'; // Mark this as a client component for interactivity

import { signOut } from 'next-auth/react';

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/' })} // Redirect to the sign-in page after sign-out
      className="block px-4 py-2 text-red-600 hover:bg-red-200"
    >
      Sign Out
    </button>
  );
}
