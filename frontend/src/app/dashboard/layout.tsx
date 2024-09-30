// app/dashboard/layout.tsx
import { ReactNode } from 'react';
import Link from 'next/link';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../api/auth/[...nextauth]/route';
import SignOutButton from '../components/SignOutButton';
import SignInPage from '../signin/page';
import { FaHome, FaUser, FaCog } from 'react-icons/fa'; // Importing icons for Home, Profile, and Settings

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <SignInPage />;
  }

  return (
    <div className="flex h-screen bg-gray-10-">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white shadow-lg" style={{ backgroundColor: 'rgb(29, 65, 101)' }}>
        <div className="p-6">
          <h2 className="text-2xl font-bold text-center shadow-md p-1.5 rounded-lg" style={{ backgroundColor: 'rgb(0, 119, 185)' }}>
            Home Screen
          </h2>
        </div>
        <nav className="mt-3 mr-2 flex flex-col items-center space-y-3">
          <Link href="/dashboard" className="font-semibold block px-4 py-2 hover:bg-gray-600 transition rounded-lg text-center flex items-center space-x-2">
            <FaHome /> {/* Home Icon */}
            <span>Home</span>
          </Link>
          <Link href="/dashboard/profile" className="font-semibold block px-4 py-2 hover:bg-gray-600 transition rounded-lg text-center flex items-center space-x-2">
            <FaUser /> {/* Profile Icon */}
            <span>Profile</span>
          </Link>
          <Link href="/dashboard/settings" className="font-semibold block px-4 py-2 hover:bg-gray-600 transition rounded-lg text-center flex items-center space-x-2">
            <FaCog /> {/* Settings Icon */}
            <span>Settings</span>
          </Link>
          <SignOutButton />
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <header className="flex justify-between items-center bg-white shadow-md p-4">
          <h1 className="text-2xl font-bold text-gray-800 mt-3">Welcome, {session.user?.name} 🎉</h1>
          <div className="flex items-center space-x-4">
            <button className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-200 transition font-bold">Notifications</button>
            <SignOutButton />
          </div>
        </header>
        <div className="p-6 flex-1 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
