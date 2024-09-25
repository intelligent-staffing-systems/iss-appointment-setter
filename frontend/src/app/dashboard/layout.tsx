// src/app/dashboard/layout.tsx
import { ReactNode } from 'react';
import Link from 'next/link';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../api/auth/[...nextauth]/route';
import SignOutButton from '../components/SignOutButton';

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <div className="text-center p-8">Please sign in to access the dashboard.</div>;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg">
        <div className="p-6 custom-header">
          <h2 className="text-xl font-bold text-center">Dashboard</h2>
        </div>
        <nav className="mt-6 space-y-3">
          <Link href="/dashboard" className="block px-4 py-2 text-gray-700 hover:bg-gray-200 transition rounded-md">
            Home
          </Link>
          <Link href="/dashboard/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-200 transition rounded-md">
            Profile
          </Link>
          <Link href="/dashboard/settings" className="block px-4 py-2 text-gray-700 hover:bg-gray-200 transition rounded-md">
            Settings
          </Link>
          <SignOutButton />
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-50 overflow-auto">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 text-center">Welcome, {session.user?.name}</h1>
        </header>
        <div className="bg-white p-6 rounded-lg shadow-md">
          {children}
        </div>
      </main>
    </div>
  );
}
