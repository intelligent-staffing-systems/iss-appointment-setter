'use client';

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, isToday, isValid } from 'date-fns';
import { Dialog } from '@headlessui/react';

interface CalendarEvent {
  id: string;
  subject: string;
  start: { dateTime: string };
  end: { dateTime: string };
}

// Fetch events from Microsoft Graph API
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

// Update event using Microsoft Graph API
const updateOutlookEvent = async (accessToken: string, eventId: string, updatedEvent: Partial<CalendarEvent>) => {
  try {
    const response = await fetch(`https://graph.microsoft.com/v1.0/me/events/${eventId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedEvent),
    });

    if (!response.ok) {
      throw new Error(`Error updating event: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating event:', error);
  }
};

// Delete event using Microsoft Graph API
const deleteOutlookEvent = async (accessToken: string, eventId: string) => {
  try {
    const response = await fetch(`https://graph.microsoft.com/v1.0/me/events/${eventId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error deleting event: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error deleting event:', error);
  }
};

export default function OutlookCalendar() {
  const { data: session } = useSession();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editForm, setEditForm] = useState<Partial<CalendarEvent>>({});
  const [isHydrated, setIsHydrated] = useState(false); // Track hydration state

  useEffect(() => {
    setIsHydrated(true); // Set hydrated to true after client-side rendering
  }, []);

  useEffect(() => {
    if (session?.accessToken) {
      fetchOutlookCalendarEvents(session.accessToken)
        .then(fetchedEvents => {
          setEvents(fetchedEvents);
        })
        .catch(error => {
          console.error('Error fetching events:', error);
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

  // Handle event click to open modal for editing or deleting
  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setEditForm({
      subject: event.subject,
      start: event.start,
      end: event.end,
    });
    setIsModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (session?.accessToken && selectedEvent) {
      await updateOutlookEvent(session.accessToken, selectedEvent.id, editForm);
      setIsModalOpen(false);
      // Refetch events to update the UI
      fetchOutlookCalendarEvents(session.accessToken).then(setEvents);
    }
  };

  const handleDelete = async (eventId: string) => {
    if (session?.accessToken) {
      await deleteOutlookEvent(session.accessToken, eventId);
      setIsModalOpen(false);
      setSelectedEvent(null);
      // Refetch events to update the UI
      fetchOutlookCalendarEvents(session.accessToken).then(setEvents);
    }
  };

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
                {isValid(new Date(event.start.dateTime)) ? format(new Date(event.start.dateTime), 'p') : 'Invalid Date'} {event.subject}
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
                    <p className="font-semibold">
                      {isValid(new Date(event.start.dateTime)) ? format(new Date(event.start.dateTime), 'p') : 'Invalid Date'} - {event.subject}
                    </p>
                    <p className="text-xs text-gray-400">30 min</p>
                  </div>
                </div>
                <button
                  onClick={() => handleEventClick(event)}
                  className="mt-2 bg-blue-500 text-white text-xs px-2 py-1 rounded"
                >
                  Edit
                </button>
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

      {/* Modal for editing and deleting events */}
      {selectedEvent && (
        <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} className="fixed inset-0 z-10">
          <div className="flex items-center justify-center min-h-screen bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full relative">
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-2 right-2 text-gray-600 text-2xl font-bold"
              >
                &times;
              </button>
              <Dialog.Title className="text-xl font-bold mb-4">Edit Event</Dialog.Title>
              <label className="block mb-2">
                <span>Subject:</span>
                <input
                  type="text"
                  className="border px-2 py-1 w-full"
                  value={editForm.subject || ''}
                  onChange={(e) => setEditForm({ ...editForm, subject: e.target.value })}
                />
              </label>
              <label className="block mb-2">
                <span>Start Time:</span>
                <input
                  type="datetime-local"
                  className="border px-2 py-1 w-full"
                  value={isValid(new Date(editForm.start?.dateTime || '')) ? format(new Date(editForm.start?.dateTime || ''), "yyyy-MM-dd'T'HH:mm") : ''}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      start: { dateTime: new Date(e.target.value).toISOString() },
                    })
                  }
                />
              </label>
              <label className="block mb-2">
                <span>End Time:</span>
                <input
                  type="datetime-local"
                  className="border px-2 py-1 w-full"
                  value={isValid(new Date(editForm.end?.dateTime || '')) ? format(new Date(editForm.end?.dateTime || ''), "yyyy-MM-dd'T'HH:mm") : ''}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      end: { dateTime: new Date(e.target.value).toISOString() },
                    })
                  }
                />
              </label>

              {/* Save and Delete buttons */}
              <div className="flex justify-end space-x-4 mt-4">
                <button
                  onClick={handleSaveEdit}
                  className="bg-green-500 text-white px-4 py-2 rounded-md"
                >
                  Save
                </button>
                <button
                  onClick={() => handleDelete(selectedEvent?.id || '')}
                  className="bg-red-500 text-white px-4 py-2 rounded-md"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
}
