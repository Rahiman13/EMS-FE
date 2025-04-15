import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './Calendar.css';

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const CalendarComponent = () => {
  const user = useSelector((state) => state.auth.user);
  const [events, setEvents] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [newEvent, setNewEvent] = useState({
    title: '',
    start: new Date(),
    end: new Date(),
    type: 'event',
  });

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const mockEvents = [
          {
            id: 1,
            title: 'Team Meeting',
            start: new Date(2024, 3, 15, 10, 0),
            end: new Date(2024, 3, 15, 11, 0),
            type: 'event',
          },
          {
            id: 2,
            title: 'Project Deadline',
            start: new Date(2024, 3, 20),
            end: new Date(2024, 3, 20),
            type: 'deadline',
          },
          {
            id: 3,
            title: 'Public Holiday',
            start: new Date(2024, 3, 25),
            end: new Date(2024, 3, 25),
            type: 'holiday',
          },
        ];
        setEvents(mockEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  const handleSelectSlot = (slotInfo) => {
    setNewEvent({
      ...newEvent,
      start: slotInfo.start,
      end: slotInfo.end,
    });
    setOpenDialog(true);
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedEvent(null);
    setNewEvent({
      title: '',
      start: new Date(),
      end: new Date(),
      type: 'event',
    });
  };

  const handleSaveEvent = async () => {
    try {
      if (selectedEvent) {
        const updatedEvents = events.map((event) =>
          event.id === selectedEvent.id ? { ...event, ...newEvent } : event
        );
        setEvents(updatedEvents);
      } else {
        const newEventWithId = {
          ...newEvent,
          id: events.length + 1,
        };
        setEvents([...events, newEventWithId]);
      }
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving event:', error);
    }
  };

  const eventStyleGetter = (event) => {
    let className = 'event-default';
    if (event.type === 'holiday') {
      className = 'event-holiday';
    } else if (event.type === 'deadline') {
      className = 'event-deadline';
    }

    return {
      className,
    };
  };

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Calendar</h1>
        <div className="flex space-x-2">
          <span className="badge badge-primary">Events</span>
          <span className="badge badge-error">Holidays</span>
          <span className="badge badge-warning">Deadlines</span>
        </div>
      </div>

      <div className="card card-hover overflow-hidden">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '70vh' }}
          onSelectSlot={user?.role === 'CEO' ? handleSelectSlot : undefined}
          onSelectEvent={handleSelectEvent}
          selectable={user?.role === 'CEO'}
          eventPropGetter={eventStyleGetter}
          className="calendar-wrapper"
        />
      </div>

      {openDialog && (
        <div className="dialog-overlay" onClick={handleCloseDialog}>
          <div 
            className="dialog animate-slide-up"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-6">
              <h2 className="section-title">
                {selectedEvent ? 'Edit Event' : 'Create New Event'}
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    value={selectedEvent ? selectedEvent.title : newEvent.title}
                    onChange={(e) =>
                      selectedEvent
                        ? setSelectedEvent({ ...selectedEvent, title: e.target.value })
                        : setNewEvent({ ...newEvent, title: e.target.value })
                    }
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date & Time
                    </label>
                    <input
                      type="datetime-local"
                      className="input-field"
                      value={format(
                        selectedEvent ? selectedEvent.start : newEvent.start,
                        "yyyy-MM-dd'T'HH:mm"
                      )}
                      onChange={(e) => {
                        const date = new Date(e.target.value);
                        if (selectedEvent) {
                          setSelectedEvent({ ...selectedEvent, start: date });
                        } else {
                          setNewEvent({ ...newEvent, start: date });
                        }
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Date & Time
                    </label>
                    <input
                      type="datetime-local"
                      className="input-field"
                      value={format(
                        selectedEvent ? selectedEvent.end : newEvent.end,
                        "yyyy-MM-dd'T'HH:mm"
                      )}
                      onChange={(e) => {
                        const date = new Date(e.target.value);
                        if (selectedEvent) {
                          setSelectedEvent({ ...selectedEvent, end: date });
                        } else {
                          setNewEvent({ ...newEvent, end: date });
                        }
                      }}
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2 mt-6">
                  <button
                    onClick={handleCloseDialog}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveEvent}
                    className="btn-primary"
                  >
                    {selectedEvent ? 'Update' : 'Create'} Event
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarComponent; 