// src/components/SignOutButton.tsx
'use client'; 

import { signOut } from 'next-auth/react';

export default function SignOutButton() {
  return (
    <a
      onClick={() => signOut({ callbackUrl: '/' })} // Redirect to the sign-in page after sign-out
      className="font-semibold block px-4 py-2 text-red-600 hover:bg-red-100 transition rounded-lg"
    >
      Sign Out
    </a>
  );
}
