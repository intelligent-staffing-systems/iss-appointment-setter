// src/app/dashboard/layout.tsx
import { ReactNode } from 'react';
import Link from 'next/link';
import { getServerSession } from "next-auth/next"
import { authOptions } from "../api/auth/[...nextauth]/route"

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return <div>Please sign in to access the dashboard.</div>;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-4">
          <h2 className="text-xl font-semibold">Dashboard</h2>
        </div>
        <nav className="mt-6">
          <Link href="/dashboard" className="block px-4 py-2 text-gray-600 hover:bg-gray-200">
            Home
          </Link>
          <Link href="/dashboard/profile" className="block px-4 py-2 text-gray-600 hover:bg-gray-200">
            Profile
          </Link>
          <Link href="/dashboard/settings" className="block px-4 py-2 text-gray-600 hover:bg-gray-200">
            Settings
          </Link>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Welcome, {session.user?.name}</h1>
        </header>
        {children}
      </main>
    </div>
  );
}
