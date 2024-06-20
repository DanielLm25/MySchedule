import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import axios from 'axios';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import SearchBar from '../Components/SearchBar';
import Modal from '../Components/Modal';
import BlockDaysModal from '../Components/BlockDaysModal';
import BlockedDayModal from '@/Components/BlockedDayModal';

export default function Agenda({ auth }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isInitialModalOpen, setIsInitialModalOpen] = useState(false);
  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);
  const [isEditEventModalOpen, setIsEditEventModalOpen] = useState(false);
  const [isBlockDaysModalOpen, setIsBlockDaysModalOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [eventToEdit, setEventToEdit] = useState(null);
  const [error, setError] = useState(null);
  const [eventsForSelectedDate, setEventsForSelectedDate] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(auth.user);
  const [blockedDays, setBlockedDays] = useState([]);
  const [selectedBlockedDay, setSelectedBlockedDay] = useState(null); // Estado para armazenar o dia bloqueado selecionado

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      fetchBlockedDays(selectedUser.id);
    }
  }, [selectedUser]);

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`/events?user_id=${selectedUser.id}`);
      console.log('Eventos recuperados:', response.data); // Adiciona um log dos eventos recuperados
      setEvents(response.data);
      localStorage.setItem('events', JSON.stringify(response.data));
    } catch (error) {
      console.error('Erro ao buscar eventos:', error);
      setError('Falha ao carregar eventos. Por favor, tente novamente mais tarde.');
    }
  };


  const fetchBlockedDays = async (userId) => {
    try {
      const response = await axios.get(`/blocked-days?user_id=${userId}`);
      setBlockedDays(response.data);
    } catch (error) {
      console.error('Erro ao buscar dias bloqueados:', error);
      setError('Falha ao carregar dias bloqueados. Por favor, tente novamente mais tarde.');
    }
  };


  const handleDateClick = (info) => {
    const clickedDateUTC = new Date(info.date);
    const clickedDateStr = clickedDateUTC.toISOString().slice(0, 10);

    const clickedBlockedDay = blockedDays.find((day) => {
      // Verifica se o dia bloqueado pertence ao usuário selecionado
      return day.user_id === selectedUser.id && (
        (day.type === "specific" && day.start_date === clickedDateStr) ||
        (day.type === "range" && clickedDateStr >= day.start_date && clickedDateStr <= day.end_date) ||
        (day.type === "recurring" && day.recurring_days.includes(clickedDateUTC.getUTCDay()))
      );
    });

    if (clickedBlockedDay) {
      setSelectedBlockedDay(clickedBlockedDay);
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
    if (!selectedUser) {
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
      console.error('Erro ao editar evento:', error);
    }
  };

  const handleAddEvent = async (newEvent) => {
    try {
      const formattedDate = selectedDate.toISOString().split('T')[0];

      newEvent.user_id = selectedUser ? selectedUser.id : null;
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
        days_of_week: addedEvent.days_of_week,
      };

      const updatedEvents = [...events, formattedEvent];
      setEvents(updatedEvents);
      saveEventsToLocalStorage(updatedEvents);

      handleCloseModals();
      fetchEvents();
    } catch (error) {
      console.error('Erro ao adicionar evento:', error);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      await axios.delete(`/events/${eventId}`);
      fetchEvents();
      setEventsForSelectedDate(prevEvents => prevEvents.filter(event => event.id !== eventId));
    } catch (error) {
      console.error('Erro ao deletar evento:', error);
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
    <AuthenticatedLayout user={auth.user} header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>}>
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900">
              <SearchBar setEvents={setEvents} setUsers={setUsers} onSelectEvent={handleSelectEvent} setSelectedUser={setSelectedUser} />
              <div className="container mx-auto mt-4">
                {error && <div className="text-red-500">{error}</div>}
                <div className="flex justify-between items-center mb-4">
                  <button
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                    onClick={() => {
                      setSelectedDate(new Date());
                      setIsAddEventModalOpen(true);
                    }}
                  >
                    Add Event
                  </button>
                  {auth.user.id === selectedUser.id && ( // Mostra o botão apenas se o usuário autenticado for o proprietário da agenda
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
                  events={events.map(event => {
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

                    // Verifica se o dia é bloqueado para o usuário selecionado
                    const isBlocked = blockedDays.some((day) => {
                      return day.user_id === selectedUser.id &&
                        ((day.type === "specific" && day.start_date === dateStr) ||
                          (day.type === "range" && dateStr >= day.start_date && dateStr <= day.end_date) ||
                          (day.type === "recurring" && day.recurring_days.includes(arg.date.getUTCDay())));
                    });

                    return (
                      <>
                        {arg.dayNumberText}
                        {isBlocked && (
                          <div className="d-block text-center mt-1">
                            <span className="badge bg-danger">Blocked</span>
                          </div>
                        )}
                      </>
                    );
                  }}

                />

                {selectedBlockedDay && (
                  <BlockedDayModal
                    show={true} // Deve controlar a visibilidade do modal
                    onClose={() => setSelectedBlockedDay(null)} // Função para fechar o modal
                    blockedDay={selectedBlockedDay} // Informações do dia bloqueado para exibir no modal
                    selectedUser={selectedUser} // Passa o usuário selecionado para o modal
                    authUserId={auth.user.id} // Passa o ID do usuário autenticado para o modal
                  />
                )}

              </div>
            </div>
          </div>
        </div>
      </div>

      <BlockDaysModal
        show={isBlockDaysModalOpen && auth.user.id === selectedUser.id} // Somente mostra se o usuário autenticado for o proprietário da agenda
        onClose={closeBlockDaysModal}
        fetchBlockedDays={fetchBlockedDays}
        selectedUser={selectedUser}
      />

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
        selectedUser={selectedUser} // Usuário selecionado para exibir na modal
      />


      <Modal
        show={isAddEventModalOpen}
        onClose={handleCloseModals}
        maxWidth="xl"
        type="add"
        selectedDate={selectedDate instanceof Date ? selectedDate.toISOString().split('T')[0] : ''}
        onAddEvent={handleAddEvent}
        selectedUser={selectedUser}
      />

      <Modal
        show={isEditEventModalOpen}
        onClose={handleCloseModals}
        maxWidth="xl"
        type="edit"
        onEditEvent={handleEditEvent}
        eventToEdit={eventToEdit}
      />
    </AuthenticatedLayout>
  );
}
