'use client';

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, isToday } from 'date-fns';

interface CalendarEvent {
  id: string;
  subject: string;
  start: { dateTime: string };
  end: { dateTime: string };
}

const fetchOutlookCalendarEvents = async (accessToken: string): Promise<CalendarEvent[]> => {
  try {
    const response = await fetch('https://graph.microsoft.com/v1.0/me/events', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching events: ${response.statusText}`);
    }

    const data = await response.json();
    return data.value; // Assuming `value` contains the array of events
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    return [];
  }
};

export default function OutlookCalendar() {
  const { data: session } = useSession();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isHydrated, setIsHydrated] = useState(false); // Track hydration state

  useEffect(() => {
    // Set hydrated to true after client-side rendering
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (session?.accessToken) {
      fetchOutlookCalendarEvents(session.accessToken)
        .then(fetchedEvents => {
          setEvents(fetchedEvents);
        })
        .catch(error => {
          console.error('Error in useEffect fetching events:', error);
        });
    }
  }, [session]);

  const nextMonth = () => setCurrentMonth(addDays(endOfMonth(currentMonth), 1));
  const prevMonth = () => setCurrentMonth(addDays(startOfMonth(currentMonth), -1));
  const resetToToday = () => {
    const today = new Date();
    setCurrentMonth(today); // Scrolls to current month
    setSelectedDate(today); // Highlights and selects today's date
  };

  // Helper function to render calendar cells
  const renderCalendarCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        const dayEvents = events.filter(event => isSameDay(new Date(event.start.dateTime), day));

        // Apply dynamic classes only after hydration to avoid mismatches
        const dynamicClasses = isHydrated
          ? `${isSameDay(day, selectedDate ?? new Date()) ? 'bg-blue-300' : ''}
             ${isToday(day) ? 'ring-2 ring-blue-500' : ''}`
          : ''; // Avoid dynamic classes on the server side

        days.push(
          <div
            className={`border p-1 cursor-pointer flex flex-col items-start h-24 w-full ${dynamicClasses}`}
            key={day.toString()}
            onClick={() => setSelectedDate(cloneDay)}
          >
            {/* Date number */}
            <span className="font-bold">{format(day, 'd')}</span>
            {/* Show first two events, with a "+x" indicator for more events */}
            {dayEvents.slice(0, 2).map(event => (
              <div key={event.id} className="bg-blue-500 text-white text-xs truncate rounded px-1 mt-1 w-full">
                {format(new Date(event.start.dateTime), 'p')} {event.subject}
              </div>
            ))}
            {/* If more than two events, show a "+x" indicator */}
            {dayEvents.length > 2 && (
              <div className="bg-gray-200 text-gray-600 text-xs rounded px-1 mt-1">
                +{dayEvents.length - 2}
              </div>
            )}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7 gap-2" key={day.toString()}>
          {days}
        </div>
      );
      days = [];
    }
    return <div>{rows}</div>;
  };

  // Helper function to render events for the selected day in the side panel
  const renderSelectedDayEvents = () => {
    const validDate = selectedDate ?? new Date();

    const dayEvents = events.filter(event => isSameDay(new Date(event.start.dateTime), validDate));
    return (
      <div className="ml-4 p-4 border-l-2 border-gray-300">
        <h2 className="text-xl mb-2">Appointments for {format(validDate, 'MMMM d, yyyy')}:</h2>
        {dayEvents.length > 0 ? (
          <ul>
            {dayEvents.map(event => (
              <li key={event.id} className="mb-2 border border-gray-300 p-2 rounded">
                <div className="flex items-center space-x-2">
                  <div className="w-1 h-full bg-blue-500"></div>
                  <div>
                    <p className="font-semibold">{format(new Date(event.start.dateTime), 'p')} - {event.subject}</p>
                    <p className="text-xs text-gray-400">30 min</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No appointments for this day.</p>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-row space-x-4">
      {/* Main Calendar Section */}
      <div className="w-2/3 bg-white p-6 rounded-lg shadow-lg">
        {/* Calendar header with navigation */}
        <div className="flex items-center space-x-9 mb-4">
          <button onClick={prevMonth} className="bg-gray-300 p-2 rounded">←</button>
          <h1 className="text-2xl font-bold">{format(currentMonth, 'MMMM yyyy')}</h1>
          <button onClick={nextMonth} className="bg-gray-300 p-2 rounded">→</button>
          <button onClick={resetToToday} className="bg-blue-500 text-white p-2 rounded ml-2">Today</button>
        </div>
        {/* Days of the week */}
        <div className="grid grid-cols-7 text-center font-semibold">
          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
        </div>
        {/* Calendar grid */}
        {renderCalendarCells()}
      </div>

      {/* Side panel to display events for the selected day */}
      <div className="w-1/3 bg-gray-50 p-6 rounded-lg shadow-lg">
        {isHydrated ? renderSelectedDayEvents() : <p>Loading appointments...</p>}
      </div>
    </div>
  );
}
