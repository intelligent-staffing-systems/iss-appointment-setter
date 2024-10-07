// src/app/profile/page.tsx

'use client';

import { useState } from 'react';

export default function ProfilePage() {
  const [userName, setUserName] = useState("Jake Loke");
  const [userEmail, setUserEmail] = useState("jakeloke@example.com");
  const [profileImage, setProfileImage] = useState("/default-avatar.png");

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl); // Show uploaded image locally
      // You can also add code to upload the image to the backend
    }
  };

  const handleSaveProfile = () => {
    // Simulate saving profile info to backend
    console.log("Profile saved!");
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Profile</h2>

      <div className="space-y-6">
        {/* Profile Picture */}
        <div className="flex items-center space-x-4">
          <img src={profileImage} alt="Profile" className="w-24 h-24 rounded-full" />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="block text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
          />
        </div>

        {/* Name */}
        <div>
          <label className="text-lg font-medium text-gray-700">Name</label>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="mt-2 block w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Email */}
        <div>
          <label className="text-lg font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            className="mt-2 block w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <button
          onClick={handleSaveProfile}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Save Profile
        </button>
      </div>
    </div>
  );
}
