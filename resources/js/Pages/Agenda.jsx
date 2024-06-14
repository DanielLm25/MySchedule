import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import NavLink from '../Components/NavLink';
import Modal from '../Components/Modal';
import axios from 'axios';

export default function Agenda() {
  const [selectedDate, setSelectedDate] = useState(new Date()); // Exemplo de data clicada
  const [isInitialModalOpen, setIsInitialModalOpen] = useState(false);
  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);
  const [isEditEventModalOpen, setIsEditEventModalOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [eventToEdit, setEventToEdit] = useState(null);
  const [error, setError] = useState(null);
  const [eventsForSelectedDate, setEventsForSelectedDate] = useState([]);

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

  const handleDateClick = (info) => {
    const clickedDateUTC = new Date(info.date);
    console.log('Data clicada (UTC):', clickedDateUTC);

    const clickedDayOfWeek = clickedDateUTC.getUTCDay();
    console.log('Dia da semana clicado:', clickedDayOfWeek);

    const eventsForClickedDate = events.filter(event => {
      console.log('Analisando evento:', event);
      if (!event.recurrence || event.recurrence === 'none') {
        const eventDateUTC = new Date(event.date);
        console.log('Evento não recorrente - Data do evento (UTC):', eventDateUTC);
        return eventDateUTC.toISOString().split('T')[0] === clickedDateUTC.toISOString().split('T')[0];
      } else if (event.recurrence === 'daily') {
        const eventStartDateUTC = new Date(event.date);
        const eventEndDateUTC = event.endDate ? new Date(event.endDate) : new Date('9999-12-31');
        console.log('Evento diário - Data de início (UTC):', eventStartDateUTC, 'Data de término (UTC):', eventEndDateUTC);
        return clickedDateUTC >= eventStartDateUTC && clickedDateUTC <= eventEndDateUTC;
      } else if (event.recurrence === 'weekly' && event.days_of_week) {
        console.log('Evento semanal - Dias da semana do evento:', event.days_of_week);
        return event.days_of_week.includes(clickedDayOfWeek);
      }
      console.log('Evento não incluído:', event);
      return false;
    });

    console.log('Eventos filtrados para a data clicada:', eventsForClickedDate);

    setSelectedDate(new Date(clickedDateUTC.getTime()));
    setEventsForSelectedDate(eventsForClickedDate);
    setIsInitialModalOpen(true);
    console.log('Modal inicial aberto com eventos:', eventsForClickedDate);
  };

  const handleCloseModals = () => {
    setIsInitialModalOpen(false);
    setIsAddEventModalOpen(false);
    setIsEditEventModalOpen(false);
    setSelectedDate('');
    setEventToEdit(null);
    setEventsForSelectedDate([]);
    console.log('Fechando todos os modais');
  };

  const handleAddEventClick = () => {
    setIsInitialModalOpen(false);
    setIsAddEventModalOpen(true);
    console.log('Abrindo modal de adicionar evento');
  };



  const handleEditEventClick = (event) => {
    setEventToEdit(event); // Passa o evento a ser editado
    setIsInitialModalOpen(false);
    setIsAddEventModalOpen(false);
    setIsEditEventModalOpen(true);
    console.log('Abrindo modal de edição de evento:', event);
  };

  const handleEditEvent = async (updatedEvent) => {
    try {
      const formattedTime = updatedEvent.time.substring(0, 5);
      updatedEvent.time = formattedTime;

      const response = await axios.put(`/events/${updatedEvent.id}`, updatedEvent);
      const editedEvent = response.data;

      const updatedEvents = events.map(event => (event.id === editedEvent.id ? editedEvent : event));
      setEvents(updatedEvents);

      saveEventsToLocalStorage(updatedEvents);

      handleCloseModals();
      console.log('Evento editado:', editedEvent);
    } catch (error) {
      console.error('Erro ao editar evento:', error);
    }
  };

  const handleAddEvent = async (newEvent) => {
    try {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      newEvent.date = formattedDate;

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
        days_of_week: addedEvent.daysOfWeek
      };

      const updatedEvents = [...events, formattedEvent];
      setEvents(updatedEvents);
      saveEventsToLocalStorage(updatedEvents);
      handleCloseModals();
      fetchEvents();
      console.log('Evento adicionado:', formattedEvent);
    } catch (error) {
      console.error('Erro ao adicionar evento:', error);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      await axios.delete(`/events/${eventId}`);
      fetchEvents();
      setEventsForSelectedDate(prevEvents => prevEvents.filter(event => event.id !== eventId));
      console.log('Evento deletado, ID:', eventId);
    } catch (error) {
      console.error('Erro ao deletar evento:', error);
    }
  };

  const saveEventsToLocalStorage = (events) => {
    localStorage.setItem('events', JSON.stringify(events));
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
            onClick={() => {
              setSelectedDate(new Date());
              setIsAddEventModalOpen(true);
              console.log('Botão de adicionar evento clicado');
            }}
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
          events={events.map(event => {
            if (event.recurrence === 'daily') {
              return {
                ...event,
                startRecur: event.date,
                endRecur: event.endDate || '9999-12-31',
              };
            } else if (event.recurrence === 'weekly') {
              return {
                ...event,
                daysOfWeek: event.days_of_week,
              };
            } else {
              return {
                ...event,
              };
            }
          })}
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
        eventsForSelectedDate={eventsForSelectedDate} // Passa os eventos filtrados por data
        fetchEvents={fetchEvents}
      />


      <Modal
        show={isAddEventModalOpen}
        onClose={handleCloseModals}
        maxWidth="xl"
        type="add"
        selectedDate={selectedDate instanceof Date ? selectedDate.toISOString().split('T')[0] : ''}
        onAddEvent={handleAddEvent}
      />


      <Modal
        show={isEditEventModalOpen}
        onClose={handleCloseModals}
        maxWidth="xl"
        type="edit"
        onEditEvent={handleEditEvent}
        eventToEdit={eventToEdit}
      />
    </div>
  );
}
