'use client';

// components/OutlookCalendar.tsx
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay } from 'date-fns';

// Define the shape of the calendar event returned by Microsoft Graph API
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

  // Helper function to render calendar cells
  const renderCalendarCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = '';

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, 'd');
        const cloneDay = day;
        const dayEvents = events.filter(event => isSameDay(new Date(event.start.dateTime), day));

        days.push(
          <div
            className={`border p-4 cursor-pointer rounded-full flex justify-center items-center h-16 w-16
              ${isSameMonth(day, monthStart) ? '' : 'text-gray-400'} 
              ${selectedDate && isSameDay(day, selectedDate) ? 'bg-blue-200' : ''}`
            }
            key={day.toString()}
            onClick={() => setSelectedDate(cloneDay)}
          >
            <span>{formattedDate}</span>
            {/* Event indicator */}
            {dayEvents.length > 0 && <div className="bg-red-500 rounded-full w-2 h-2 mt-1"></div>}
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

  // Helper function to render events for the selected date
  const renderSelectedDayEvents = () => {
    if (!selectedDate) return <p>Select a day to view appointments.</p>;

    const dayEvents = events.filter(event => isSameDay(new Date(event.start.dateTime), selectedDate));
    return (
      <div>
        <h2 className="text-xl mb-2">Appointments for {format(selectedDate, 'MMMM d, yyyy')}:</h2>
        {dayEvents.length > 0 ? (
          <ul>
            {dayEvents.map(event => (
              <li key={event.id}>
                <strong>{event.subject}</strong> - {new Date(event.start.dateTime).toLocaleString()} to {new Date(event.end.dateTime).toLocaleString()}
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
    <div>
      <h1 className="text-2xl font-bold mb-4">Future Appointments</h1>
      {/* Calendar grid */}
      <div className="grid grid-cols-7 text-center font-semibold">
        <div>Sun</div>
        <div>Mon</div>
        <div>Tue</div>
        <div>Wed</div>
        <div>Thu</div>
        <div>Fri</div>
        <div>Sat</div>
      </div>
      {renderCalendarCells()}
      {/* Appointments list for the selected day */}
      <div className="mt-4">{renderSelectedDayEvents()}</div>
    </div>
  );
}
