import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import axios from 'axios';
import Modal from '../Components/Modal';
import BlockDaysModal from '../Components/BlockDaysModal';
import BlockedDayModal from '../Components/BlockedDayModal';

export default function Agenda({ auth, selectedUser }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isInitialModalOpen, setIsInitialModalOpen] = useState(false);
  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);
  const [isEditEventModalOpen, setIsEditEventModalOpen] = useState(false);
  const [isBlockDaysModalOpen, setIsBlockDaysModalOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [eventToEdit, setEventToEdit] = useState(null);
  const [error, setError] = useState(null);
  const [eventsForSelectedDate, setEventsForSelectedDate] = useState([]);
  const [blockedDays, setBlockedDays] = useState([]);
  const [selectedBlockedDay, setSelectedBlockedDay] = useState(null);
  const [isBlockedDayModalOpen, setIsBlockedDayModalOpen] = useState(false);



  const currentUser = selectedUser || auth.user;

  useEffect(() => {
    if (selectedUser && selectedUser.id !== auth.user.id) {
      fetchEvents(selectedUser.id);
      fetchBlockedDays(selectedUser.id);
    } else if (auth.user && auth.user.id) {
      fetchEvents(auth.user.id);
      fetchBlockedDays(auth.user.id);
    }
  }, [selectedUser, auth.user]);


  const fetchEvents = async (userId) => {
    try {
      const response = await axios.get(`/user/${userId}/agenda`);
      if (response.data && response.data.length > 0) {
        console.log('Eventos recuperados:', response.data);
        setEvents(response.data);
        setError(null);
      } else {
        console.log('Nenhum evento encontrado.');
        setEvents([]);
      }
    } catch (error) {
      console.error('Erro ao carregar eventos:', error);
      setError('Erro ao carregar eventos. Por favor, tente novamente mais tarde.');
    }
  };


  const fetchBlockedDays = async (userId) => {
    try {
      console.log('Fetching blocked days for user ID:', userId);
      const response = await axios.get(`/blocked-days?user_id=${userId}`);
      console.log('Dias bloqueados recebidos:', response.data);
      if (Array.isArray(response.data)) {
        setBlockedDays(response.data);
      } else {
        console.error('Resposta não é um array:', response.data);
        setBlockedDays([]);
      }
    } catch (error) {
      console.error('Erro ao buscar dias bloqueados:', error);
      setError('Falha ao carregar dias bloqueados. Por favor, tente novamente mais tarde.');
    }
  };




  const handleDateClick = (info) => {
    const clickedDateUTC = new Date(info.date);
    const clickedDateStr = clickedDateUTC.toISOString().slice(0, 10);

    const clickedBlockedDay = blockedDays.find((day) => {
      return day.user_id === currentUser.id && (
        (day.type === "specific" && day.start_date === clickedDateStr) ||
        (day.type === "range" && clickedDateStr >= day.start_date && clickedDateStr <= day.end_date) ||
        (day.type === "recurring" && day.recurring_days.includes(clickedDateUTC.getUTCDay()))
      );
    });

    if (clickedBlockedDay) {
      setSelectedBlockedDay(clickedBlockedDay);
      setIsBlockedDayModalOpen(true);
    } else {
      const eventsForClickedDate = events.filter((event) => {
        if (!event.recurrence || event.recurrence === "none") {
          const eventDateUTC = new Date(event.date);
          return (
            eventDateUTC.toISOString().split("T")[0] ===
            clickedDateUTC.toISOString().split("T")[0]
          );
        } else if (event.recurrence === "daily") {
          const eventStartDateUTC = new Date(event.date);
          const eventEndDateUTC = event.endDate
            ? new Date(event.endDate)
            : new Date("9999-12-31");
          return (
            clickedDateUTC >= eventStartDateUTC &&
            clickedDateUTC <= eventEndDateUTC
          );
        } else if (event.recurrence === "weekly" && event.days_of_week) {
          return event.days_of_week.includes(clickedDateUTC.getUTCDay());
        }
        return false;
      });

      setSelectedDate(new Date(clickedDateUTC.getTime()));
      setEventsForSelectedDate(eventsForClickedDate);
      setIsInitialModalOpen(true);
    }
  };

  const handleSelectEvent = (event) => {
    setSelectedDate(new Date(event.date));
    setEventsForSelectedDate([event]);
    setIsInitialModalOpen(true);
  };

  const handleCloseModals = () => {
    setIsInitialModalOpen(false);
    setIsAddEventModalOpen(false);
    setIsEditEventModalOpen(false);
    setSelectedDate('');
    setEventToEdit(null);
    setEventsForSelectedDate([]);
    setSelectedBlockedDay(null); // Limpa o dia bloqueado selecionado ao fechar os modais
  };

  const handleAddEventClick = () => {
    if (!currentUser) {
      console.error('Nenhum usuário selecionado para adicionar evento.');
      return;
    }

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
      const formattedTime = updatedEvent.time.substring(0, 5);
      updatedEvent.time = formattedTime;

      const response = await axios.put(`/events/${updatedEvent.id}`, updatedEvent);
      const editedEvent = response.data;

      const updatedEvents = events.map(event => (event.id === editedEvent.id ? editedEvent : event));
      setEvents(updatedEvents);

      saveEventsToLocalStorage(updatedEvents);

      handleCloseModals();
    } catch (error) {
      console.error('Erro ao editar evento:', error.response || error.message || error);
    }
  };

  const handleAddEvent = async (newEvent) => {
    try {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      newEvent.user_id = currentUser.id; // Certifique-se de enviar o ID do usuário, não o objeto inteiro

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
        days_of_week: addedEvent.days_of_week,
      };

      const updatedEvents = [...events, formattedEvent];
      setEvents(updatedEvents);
      saveEventsToLocalStorage(updatedEvents);
      handleCloseModals();
      fetchEvents(currentUser.id); // Passa o user_id correto para atualizar os eventos
    } catch (error) {
      console.error('Erro ao adicionar evento:', error.response || error.message || error);
      if (error.response && error.response.data && error.response.data.errors) {
        const { errors } = error.response.data;
        Object.keys(errors).forEach(field => {
          console.error(`${field}: ${errors[field].join(', ')}`);
        });
        setError('Falha ao adicionar evento. Verifique os campos e tente novamente.');
      } else {
        setError('Erro ao adicionar evento. Por favor, tente novamente mais tarde.');
      }
    }
  };


  const handleDeleteEvent = async (eventId) => {
    try {
      await axios.delete(`/events/${eventId}`);
      fetchEvents();
      setEventsForSelectedDate(prevEvents => prevEvents.filter(event => event.id !== eventId));
    } catch (error) {
      console.error('Erro ao deletar evento:', error.response || error.message || error);
    }
  };

  const saveEventsToLocalStorage = (events) => {
    localStorage.setItem('events', JSON.stringify(events));
  };

  const openBlockDaysModal = () => {
    setIsBlockDaysModalOpen(true);
  };

  const closeBlockDaysModal = () => {
    setIsBlockDaysModalOpen(false);
  };
  return (
    <div className="">
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
          <div className="p-6 text-gray-900">
            <div className="container mx-auto mt-4">
              {/* Buttons and Calendar */}
              {error && <div className="text-red-500">{error}</div>}
              <div className="flex justify-between items-center mb-4">
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                  onClick={handleAddEventClick}
                >
                  Add Event
                </button>
                {auth.user.id === currentUser?.id && (
                  <button
                    className="px-4 py-2 bg-red-500 text-white rounded"
                    onClick={openBlockDaysModal}
                  >
                    Block Days
                  </button>
                )}
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
                events={events
                  .filter(event => event.user_id === (currentUser ? currentUser.id : auth.user.id))
                  .map(event => {
                    if (event.recurrence === 'daily') {
                      return {
                        ...event,
                        startRecur: event.date,
                        endRecur: event.endDate || '9999-12-31',
                        startTime: event.time,
                      };
                    } else if (event.recurrence === 'weekly') {
                      return {
                        ...event,
                        daysOfWeek: event.days_of_week,
                        startTime: event.time,
                      };
                    } else {
                      return {
                        ...event,
                        start: event.date + 'T' + event.time,
                      };
                    }
                  })}
                editable={true}
                selectable={true}
                dayCellContent={(arg) => {
                  const dateStr = arg.date.toISOString().slice(0, 10);
                  const blockedDay = blockedDays.find((day) => {
                    return day.user_id === currentUser.id && (
                      (day.type === "specific" && day.start_date === dateStr) ||
                      (day.type === "range" && dateStr >= day.start_date && dateStr <= day.end_date) ||
                      (day.type === "recurring" && day.recurring_days.includes(arg.date.getUTCDay()))
                    );
                  });

                  if (blockedDay) {
                    return <span className="text-red-500">Bloqueado</span>;
                  } else {
                    return <>{arg.dayNumberText}</>;
                  }
                }}

                eventClick={(info) => handleSelectEvent(info.event)}
              />

              {selectedBlockedDay && (
                <BlockedDayModal
                  show={isBlockedDayModalOpen}
                  onClose={handleCloseModals}
                  blockedDay={selectedBlockedDay}
                  onBlockedDayChange={() => fetchBlockedDays(currentUser.id)}
                  auth={auth}
                  selectedUser={currentUser}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <Modal
        show={isInitialModalOpen}
        onClose={handleCloseModals}
        maxWidth="xl"
        type="initial"
        onEditEvent={handleEditEventClick}
        onDeleteEvent={handleDeleteEvent}
        selectedDate={selectedDate}
        onAddEvent={handleAddEventClick}
        eventsForSelectedDate={eventsForSelectedDate}
        fetchEvents={fetchEvents}
        authUserId={auth.user.id} // ID do usuário autenticado
        selectedUser={currentUser} // Usuário selecionado para exibir na modal
      />

      <Modal
        show={isAddEventModalOpen}
        onClose={handleCloseModals}
        maxWidth="xl"
        type="add"
        selectedDate={selectedDate instanceof Date ? selectedDate.toISOString().split('T')[0] : ''}
        onAddEvent={handleAddEvent}
        selectedUser={currentUser}
      />

      <Modal
        show={isEditEventModalOpen}
        onClose={handleCloseModals}
        maxWidth="xl"
        type="edit"
        onEditEvent={handleEditEvent}
        eventToEdit={eventToEdit}
      />

      <BlockDaysModal
        show={isBlockDaysModalOpen && auth.user.id === currentUser.id} // Somente mostra se o usuário autenticado for o proprietário da agenda
        onClose={closeBlockDaysModal}
        fetchBlockedDays={fetchBlockedDays}
        selectedUser={currentUser}
      />

    </div>
  );
}  