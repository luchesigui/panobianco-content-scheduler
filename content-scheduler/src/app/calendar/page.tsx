'use client';

import { useState, useEffect, useCallback } from 'react';
import { Calendar, momentLocalizer, Event } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';

import { ContentPiece } from '@/types/content';
import { loadContentFromStorage, updateContentInStorage } from '@/utils/localStorage';
import { ContentTooltip } from '@/components/ContentTooltip';

const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop<CalendarEvent>(Calendar);

interface CalendarEvent extends Event {
  resource: ContentPiece;
}

export default function CalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number } | null>(null);

  // Load events from localStorage on component mount
  useEffect(() => {
    const contentData = loadContentFromStorage();
    const calendarEvents: CalendarEvent[] = contentData.map(content => ({
      title: content.title,
      start: new Date(content.date),
      end: new Date(content.date),
      resource: content,
    }));
    setEvents(calendarEvents);
  }, []);

  // Handle event selection for tooltip
  const handleSelectEvent = useCallback((event: CalendarEvent, e: React.SyntheticEvent) => {
    const target = e.target as HTMLElement;
    const rect = target.getBoundingClientRect();
    
    setSelectedEvent(event);
    setTooltipPosition({
      x: rect.left + rect.width / 2,
      y: rect.top - 10,
    });
  }, []);

  // Handle closing tooltip
  const handleCloseTooltip = useCallback(() => {
    setSelectedEvent(null);
    setTooltipPosition(null);
  }, []);

  // Handle marking content as published
  const handleMarkAsPublished = useCallback((contentId: string) => {
    setEvents(prevEvents => {
      const updatedEvents = prevEvents.map(event => {
        if (event.resource.id === contentId) {
          const updatedContent = { ...event.resource, isPublished: true };
          updateContentInStorage(updatedContent);
          return {
            ...event,
            resource: updatedContent,
          };
        }
        return event;
      });
      return updatedEvents;
    });
    handleCloseTooltip();
  }, [handleCloseTooltip]);

  // Handle drag and drop
  const handleEventDrop = useCallback((args: { event: CalendarEvent; start: Date | string }) => {
    const { event, start } = args;
    const startDate = typeof start === 'string' ? new Date(start) : start;
    const updatedContent = {
      ...event.resource,
      date: startDate.toISOString().split('T')[0],
    };

    // Update in localStorage
    updateContentInStorage(updatedContent);

    // Update local state
    setEvents(prevEvents => {
      return prevEvents.map(e => {
        if (e.resource.id === event.resource.id) {
          return {
            ...e,
            start: startDate,
            end: startDate,
            resource: updatedContent,
          };
        }
        return e;
      });
    });
  }, []);

  // Custom event component
  const EventComponent = ({ event }: { event: CalendarEvent }) => {
    return (
      <div className="w-full h-full cursor-pointer">
        <div className="truncate text-xs px-1">
          {event.title}
        </div>
      </div>
    );
  };

  // Event style getter
  const eventStyleGetter = (event: CalendarEvent) => {
    const isPublished = event.resource.isPublished;
    return {
      style: {
        backgroundColor: isPublished ? '#10b981' : '#374151',
        borderColor: isPublished ? '#059669' : '#1f2937',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        padding: '2px 5px',
        fontSize: '12px',
        cursor: 'pointer',
      },
    };
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Content Calendar</h1>
              <p className="text-gray-600 mt-1">
                Drag and drop events to reschedule. Hover to see details and mark as published.
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-gray-600 rounded"></div>
                <span className="text-sm text-gray-600">Not Published</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span className="text-sm text-gray-600">Published</span>
              </div>
            </div>
          </div>

          <div className="h-[600px]">
            <DnDCalendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              onSelectEvent={handleSelectEvent}
              onEventDrop={handleEventDrop}
              eventPropGetter={eventStyleGetter}
              components={{
                event: EventComponent,
              }}
              draggableAccessor={() => true}
              resizable={false}
              popup={false}
              views={['month']}
              defaultView="month"
              className="rbc-calendar-custom"
            />
          </div>
        </div>
      </div>

      {selectedEvent && tooltipPosition && (
        <ContentTooltip
          event={selectedEvent}
          position={tooltipPosition}
          onClose={handleCloseTooltip}
          onMarkAsPublished={handleMarkAsPublished}
        />
      )}
    </div>
  );
}