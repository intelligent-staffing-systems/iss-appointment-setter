// src/app/dashboard/page.tsx
import OutlookCalendar from "../components/OutlookCalendar"; // Adjust path if necessary

export default async function DashboardHome() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 gap-6">
      {/* Wider Widget - Outlook Calendar */}
      <div className="bg-white p-6 rounded-lg shadow-md col-span-1 xl:col-span-2">
        <h3 className="text-lg font-semibold mb-2 text-gray-800">Outlook Calendar</h3>
        <OutlookCalendar />
      </div>
    </div>
  );
}
