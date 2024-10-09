// src/components/LoadingScreen.tsx

import { AiOutlineLoading3Quarters } from 'react-icons/ai';

export default function LoadingScreen() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="flex items-center space-x-4">
        <AiOutlineLoading3Quarters className="animate-spin text-4xl text-blue-600" />
        <p className="text-xl font-semibold text-gray-700">Loading, please wait...</p>
      </div>
    </div>
  );
}
