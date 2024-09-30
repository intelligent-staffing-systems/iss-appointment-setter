// src/app/providers.tsx
'use client';

import { SessionProvider, signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";

// const INACTIVITY_TIMEOUT = 60 * 60 * 1000; // 1 hour in milliseconds
const INACTIVITY_TIMEOUT = 5 * 1000; // 5 seconds

export function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}

// Inactivity tracker to be used globally
export function InactivityProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const [lastActivity, setLastActivity] = useState(Date.now());

  // Function to reset the inactivity timer
  const resetInactivityTimer = () => {
    setLastActivity(Date.now());
  };

  // Effect to track user activity and check for inactivity timeout
  useEffect(() => {
    const handleUserActivity = () => resetInactivityTimer();

    // Add event listeners to track user activity
    window.addEventListener('mousemove', handleUserActivity);
    window.addEventListener('keydown', handleUserActivity);

    const interval = setInterval(() => {
      if (Date.now() - lastActivity > INACTIVITY_TIMEOUT) {
        console.log('Inactivity timeout: Logging out...');
        signOut(); // Automatically logs out after inactivity
      }
    }, 1000); // Check every second

    // Clean up event listeners and interval
    return () => {
      window.removeEventListener('mousemove', handleUserActivity);
      window.removeEventListener('keydown', handleUserActivity);
      clearInterval(interval);
    };
  }, [lastActivity]);

  return <>{children}</>;
}
