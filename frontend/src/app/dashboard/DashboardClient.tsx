// src/app/dashboard/DashboardClient.tsx
'use client'
import { useEffect, useState } from 'react';

export default function DashboardClient() {
  const [apiMessage, setApiMessage] = useState('');

  useEffect(() => {
    async function testBackendConnection() {
      try {
        const response = await fetch('/api/v1/appointments');
        const data = await response.json();
        setApiMessage(data.message);
      } catch (error) {
        console.error('Error connecting to backend:', error);
        setApiMessage('Failed to connect to backend');
      }
    }

    testBackendConnection();
  }, []);

  return (
    <div>
      <h3>Backend Connection Test</h3>
      <p>API Message: {apiMessage}</p>
    </div>
  );
}
