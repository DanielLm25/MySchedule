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
    const clickedDate = info.date; // Use info.date em vez de info.dateStr
    setSelectedDate(clickedDate);
    setIsInitialModalOpen(true);
    console.log('Data selecionada:', clickedDate);

    // Adicione um log específico para o dia da semana selecionado
    const dayOfWeek = clickedDate.getDay();
    const dayOfWeekNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    console.log('Dia da semana selecionado:', dayOfWeekNames[dayOfWeek]);
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
    setSelectedDate(event.start);
    setIsInitialModalOpen(false);
    setIsEditEventModalOpen(true);
  };

  const handleEditEvent = async (updatedEvent) => {
    try {
      const formattedTime = updatedEvent.time.substring(0, 5); // Formata a hora para 'HH:mm'
      updatedEvent.time = formattedTime; // Atualiza a hora no evento atualizado

      const response = await axios.put(`/events/${updatedEvent.id}`, updatedEvent);
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
        color: addedEvent.color,
        recurrence: addedEvent.recurrence,
        days_of_week: addedEvent.daysOfWeek // Adicione days_of_week
      };
      const updatedEvents = [...events, formattedEvent]; // Adiciona o novo evento ao array de eventos existentes
      console.log('Novo evento formatado:', formattedEvent);
      console.log('Eventos atualizados antes de setEvents:', updatedEvents);
      setEvents(updatedEvents); // Atualiza o estado local de eventos
      saveEventsToLocalStorage(updatedEvents); // Salva os eventos atualizados no armazenamento local
      handleCloseModals();
      fetchEvents(); // Você precisa recuperar os eventos atualizados após adicionar um novo evento
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
    const selectedDateObj = new Date(selectedDate);
    const selectedDayOfWeek = selectedDateObj.getDay();
    const daysOfWeekOrdered = [1, 2, 3, 4, 5, 6, 0]; // Segunda a Domingo

    const filteredEvents = events.filter(event => {
      const eventDate = new Date(event.date);
      const eventDayOfWeek = eventDate.getDay();

      const isSameDate = selectedDateObj.toDateString() === eventDate.toDateString();

      if (isSameDate) {
        return true;
      }

      if (
        event.recurrence === 'weekly' &&
        event.days_of_week &&
        event.days_of_week.includes(daysOfWeekOrdered[selectedDayOfWeek])
      ) {
        return true;
      }

      return false;
    });

    return filteredEvents;
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
          events={events.map(event => ({
            ...event,
            daysOfWeek: event.recurrence === 'weekly' ? event.days_of_week : undefined,
            startRecur: event.recurrence === 'daily' ? event.date : undefined,
            endRecur: event.recurrence === 'daily' ? event.endDate : undefined,
          }))}
          editable={true}
          selectable={true}
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
        <h2 className="text-lg font-semibold mb-4">Events for {new Date(selectedDate).toDateString()}</h2>
        {getEventsForSelectedDate().map(event => (
          event.id && (
            <div key={event.id} className="mb-2 flex justify-between items-center">
              <div>
                <p><strong>{event.title}</strong></p>
                <p>{event.description}</p>
              </div>
              <div>
                <button className="px-2 py-1 bg-yellow-500 text-white rounded mr-2" onClick={() => handleEditEventClick(event)}>Edit</button>
                <button className="px-2 py-1 bg-red-500 text-white rounded" onClick={() => handleDeleteEvent(event.id)}>Delete</button>
              </div>
            </div>
          )
        ))}

      </Modal>


      <Modal
        show={isAddEventModalOpen}
        onClose={handleCloseModals}
        maxWidth="xl"
        type="add"
        selectedDate={selectedDate}
        onAddEvent={handleAddEvent}
        setIsModalOpen={setIsAddEventModalOpen}
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
      >
        <h2 className="text-lg font-semibold mb-4">Edit Event</h2>
      </Modal>
    </div>
  );
}