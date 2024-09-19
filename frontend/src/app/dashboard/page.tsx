// src/app/dashboard/page.tsx
import { getServerSession } from "next-auth/next"
import { authOptions } from "../api/auth/[...nextauth]/route"
import DashboardClient from './DashboardClient'
import AppointmentSetter from './AppointmentSetter'

export default async function DashboardHome() {
  const session = await getServerSession(authOptions)

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Dashboard Home</h2>
      <p>Hello, {session?.user?.name}! This is your dashboard.</p>
      <DashboardClient />
      <AppointmentSetter />
    </div>
  );
}
