// src/app/dashboard/page.tsx
import OutlookCalendar from "../components/OutlookCalendar"; // Adjust path if necessary

export default async function DashboardHome() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Welcome Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Dashboard Overview</h2>
        <p className="text-gray-600">This is where you'll find quick insights and actions.</p>
      </div>

      {/* Widget 1 */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-2 text-gray-800">Widget 1</h3>
        <p className="text-gray-600">Placeholder for future content.</p>
      </div>

      {/* Widget 2 - Outlook Calendar */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-2 text-gray-800">Outlook Calendar</h3>
        <OutlookCalendar />
      </div>

      {/* Widget 3 */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-2 text-gray-800">Widget 3</h3>
        <p className="text-gray-600">Placeholder for future content.</p>
      </div>
    </div>
  );
}
