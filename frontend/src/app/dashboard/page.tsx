// src/app/dashboard/page.tsx
import { getServerSession } from "next-auth/next"
import { authOptions } from "../api/auth/[...nextauth]/route"

export default async function DashboardHome() {
  const session = await getServerSession(authOptions)

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Dashboard Home</h2>
      <p>Hello, {session?.user?.name}! This is your dashboard.</p>
      {/* Add more dashboard content here */}
    </div>
  );
}
