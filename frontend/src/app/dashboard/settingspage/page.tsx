// src/app/dashboard/settingspage/page.tsx

'use client';

import { useState } from 'react';

export default function SettingsPage() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [emailUpdates, setEmailUpdates] = useState(true);

  const handleSaveSettings = () => {
    // Simulate saving settings to backend
    console.log("Settings saved!");
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Settings</h2>

      <div className="space-y-6">
        {/* Notification Settings */}
        <div>
          <label className="text-lg font-medium text-gray-700">Enable Notifications</label>
          <div className="mt-2">
            <input
              type="checkbox"
              checked={notificationsEnabled}
              onChange={() => setNotificationsEnabled(!notificationsEnabled)}
            />
            <span className="ml-2 text-sm text-gray-600">Receive push notifications for updates</span>
          </div>
        </div>

        {/* Dark Mode */}
        <div>
          <label className="text-lg font-medium text-gray-700">Dark Mode</label>
          <div className="mt-2">
            <input
              type="checkbox"
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
            />
            <span className="ml-2 text-sm text-gray-600">Enable dark theme for the app</span>
          </div>
        </div>

        {/* Email Updates */}
        <div>
          <label className="text-lg font-medium text-gray-700">Email Updates</label>
          <div className="mt-2">
            <input
              type="checkbox"
              checked={emailUpdates}
              onChange={() => setEmailUpdates(!emailUpdates)}
            />
            <span className="ml-2 text-sm text-gray-600">Receive weekly email updates</span>
          </div>
        </div>

        <button
          onClick={handleSaveSettings}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Save Settings
        </button>
      </div>
    </div>
  );
}
