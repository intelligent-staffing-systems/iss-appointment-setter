// src/app/dashboard/page.tsx
import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/route";

export default async function DashboardHome() {
  const session = await getServerSession(authOptions);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4 text-gray-700">Dashboard Home</h2>
      <p className="mb-4 text-gray-600">Hello, {session?.user?.name}! Here is your dashboard overview.</p>
      
      {/* Future dashboard-specific content */}
      <div className="bg-gray-50 p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-2 text-gray-800">Your Dashboard Content</h3>
        <p className="text-gray-600">This section will contain widgets, charts, and other utilities in the future.</p>
      </div>
    </div>
  );
}
