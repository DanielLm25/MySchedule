import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import NavLink from '../Components/NavLink';
import Modal from '../Components/Modal';
import axios from 'axios';

export default function Agenda() {
  const [selectedDate, setSelectedDate] = useState('');
  const [isInitialModalOpen, setIsInitialModalOpen] = useState(false);
  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);
  const [isEditEventModalOpen, setIsEditEventModalOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [eventToEdit, setEventToEdit] = useState(null);
  const [error, setError] = useState(null);
  const [calendarView, setCalendarView] = useState('dayGridMonth'); // Estado para controlar a visualização do calendário


  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get('/events');
      setEvents(response.data);
      localStorage.setItem('events', JSON.stringify(response.data));
      console.log('Eventos recuperados:', response.data);
    } catch (error) {
      console.error('Erro ao buscar eventos:', error);
      setError('Falha ao carregar eventos. Por favor, tente novamente mais tarde.');
    }
  };

  const saveEventsToLocalStorage = (events) => {
    localStorage.setItem('events', JSON.stringify(events));
  };

  const handleDateClick = (info) => {
    setSelectedDate(info.dateStr);
    setIsInitialModalOpen(true);
  };

  const handleCloseModals = () => {
    setIsInitialModalOpen(false);
    setIsAddEventModalOpen(false);
    setIsEditEventModalOpen(false);
    setSelectedDate('');
    setEventToEdit(null);
  };

  const handleAddEventClick = () => {
    setIsInitialModalOpen(false);
    setIsAddEventModalOpen(true);
  };

  const handleEditEventClick = (event) => {
    setEventToEdit(event);
    setIsInitialModalOpen(false);
    setIsEditEventModalOpen(true);
  };

  const handleEditEvent = async (updatedEvent) => {
    try {
      const formattedTime = updatedEvent.time.split(':').slice(0, 2).join(':');

      const formattedEvent = {
        id: updatedEvent.id,
        title: updatedEvent.title,
        start: updatedEvent.date,
        description: updatedEvent.description,
        time: formattedTime,
        date: updatedEvent.date,
      };

      const response = await axios.put(`/events/${updatedEvent.id}`, formattedEvent);
      const editedEvent = response.data;

      const updatedEvents = events.map(event => (event.id === editedEvent.id ? editedEvent : event));
      setEvents(updatedEvents);

      saveEventsToLocalStorage(updatedEvents);

      handleCloseModals();
    } catch (error) {
      console.error('Error editing event:', error);
    }
  };

  const handleAddEvent = async (newEvent) => {
    try {
      const response = await axios.post('/events', newEvent);
      const addedEvent = response.data;
      const formattedEvent = {
        id: addedEvent.id,
        title: addedEvent.title,
        start: addedEvent.date,
        description: addedEvent.description,
        time: addedEvent.time,
      };
      const updatedEvents = [...events, formattedEvent];
      setEvents(updatedEvents);
      saveEventsToLocalStorage(updatedEvents);
      handleCloseModals();
    } catch (error) {
      console.error('Error adding event:', error);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      await axios.delete(`/events/${eventId}`);
      const updatedEvents = events.filter(event => event.id !== eventId);
      setEvents(updatedEvents);
      saveEventsToLocalStorage(updatedEvents);
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const getEventsForSelectedDate = () => {
    return events.filter(event => event.start === selectedDate);
  };

  const handleViewChange = (view) => {
    setCalendarView(view);
  };
  return (
    <div>
      <nav className="bg-gray-800">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
          <div className="relative flex items-center justify-between h-16">
            <div className="flex items-center justify-center">
              <div className="flex-shrink-0 text-white">Logo</div>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  <NavLink href="/agenda" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                    Agenda
                  </NavLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <div className="container mx-auto mt-4">
        {error && <div className="text-red-500">{error}</div>}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Agenda</h2>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded"
            onClick={handleAddEventClick}
          >
            Add Event
          </button>
        </div>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay',
          }}
          dateClick={handleDateClick}
          events={events}
        />
      </div>

      <Modal
        show={isInitialModalOpen}
        onClose={handleCloseModals}
        maxWidth="xl"
        type="initial"
        onEditEvent={handleEditEventClick}
        onDeleteEvent={handleDeleteEvent}
        selectedDate={selectedDate}
        onAddEvent={handleAddEventClick}
      >
        <h2 className="text-lg font-semibold mb-4">Events for {selectedDate}</h2>
        {getEventsForSelectedDate().length > 0 ? (
          getEventsForSelectedDate().map(event => (
            <div key={event.id} className="mb-2">
              <p><strong>{event.title}</strong></p>
              <p>{event.description}</p>
              <button onClick={() => handleEditEventClick(event)}>Edit</button>
              <button onClick={() => handleDeleteEvent(event.id)}>Delete</button>
            </div>
          ))
        ) : (
          <p>No events for this date.</p>
        )}
      </Modal>

      <Modal
        show={isAddEventModalOpen}
        onClose={handleCloseModals}
        maxWidth="xl"
        type="add"
        selectedDate={selectedDate}
        onAddEvent={handleAddEvent}
      >
        <h2 className="text-lg font-semibold mb-4">Add Event</h2>
      </Modal>

      <Modal
        show={isEditEventModalOpen}
        onClose={handleCloseModals}
        maxWidth="xl"
        type="edit"
        onEditEvent={handleEditEvent}
        eventToEdit={eventToEdit}
        selectedDate={selectedDate}
        onDeleteEvent={handleDeleteEvent}
      >
        <h2 className="text-lg font-semibold mb-4">Edit Event</h2>
      </Modal>
    </div>
  );
}
