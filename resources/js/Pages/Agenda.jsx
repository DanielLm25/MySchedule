import React, { useState, useEffect, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import axios from 'axios';
import Modal from '../Components/Modal';
import BlockDaysModal from '../Components/BlockDaysModal';
import BlockedDayModal from '../Components/BlockedDayModal';
import { FaPlus, FaLock, FaChevronLeft, FaChevronRight, FaCalendarDay } from 'react-icons/fa';

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

  const calendarRef = useRef(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  const currentUser = selectedUser || auth.user;

  useEffect(() => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      setCurrentDate(calendarApi.getDate());
    }
  }, []);

  const handleDateChange = (date) => {
    setCurrentDate(date);
  };


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
    const clickedDateUTC = new Date(event.start);
    const clickedDateStr = clickedDateUTC.toISOString().slice(0, 10);

    const eventsForClickedDate = events.filter((e) => {
      if (!e.recurrence || e.recurrence === "none") {
        const eventDateUTC = new Date(e.date);
        return (
          eventDateUTC.toISOString().split("T")[0] ===
          clickedDateUTC.toISOString().split("T")[0]
        );
      } else if (e.recurrence === "daily") {
        const eventStartDateUTC = new Date(e.date);
        const eventEndDateUTC = e.endDate
          ? new Date(e.endDate)
          : new Date("9999-12-31");
        return (
          clickedDateUTC >= eventStartDateUTC &&
          clickedDateUTC <= eventEndDateUTC
        );
      } else if (e.recurrence === "weekly" && e.days_of_week) {
        return e.days_of_week.includes(clickedDateUTC.getUTCDay());
      }
      return false;
    });

    setSelectedDate(new Date(clickedDateUTC.getTime()));
    setEventsForSelectedDate(eventsForClickedDate);
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
      // Deleta o evento
      await axios.delete(`/events/${eventId}`);

      // Atualiza a lista de eventos, excluindo o evento deletado
      setEvents(prevEvents => prevEvents.filter(event => event.id !== eventId));

      // Atualiza os eventos para a data selecionada
      setEventsForSelectedDate(prevEvents => prevEvents.filter(event => event.id !== eventId));

      // Recarrega os eventos do usuário atual
      fetchEvents(currentUser.id);
    } catch (error) {
      console.error('Erro ao deletar evento:', error.response || error.message || error);
      setError('Erro ao deletar evento. Por favor, tente novamente mais tarde.');
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
    <div className="min-h-screen bg-gradient-to-r from-blue-200 via-blue-300 to-blue-400">
      <div className="max-w-[1400px] mx-auto sm:px-2 md:px-4 lg:px-6 mt-2">
        <div className="bg-gray-100 overflow-hidden shadow-md rounded-lg h-[calc(100vh-5rem)] "> {/* Ajusta a altura */}
          <div className="text-gray-900 h-full flex flex-col">
            <div className="flex flex-col md:flex-row h-full">
              {/* Sidebar with Buttons */}
              <div className="flex-shrink-0 w-full md:w-48 p-4 flex flex-col space-y-4 bg-blue-400"> {/* Reduz a largura e o padding */}
                {error && (
                  <div className="bg-red-100 border border-red-500 text-red-700 px-3 py-1 rounded-lg mb-4"> {/* Ajusta o padding e a margem */}
                    {error}
                  </div>
                )}

                <button
                  className="flex items-center px-4 py-2 bg-blue-700 text-white rounded-lg shadow-md hover:bg-white hover:shadow-lg text-base transition-transform hover:scale-105 w-full hover:text-blue-700"
                  onClick={handleAddEventClick}
                >
                  <FaPlus className="mr-2 text-lg" />
                  Add Event
                </button>

                {auth.user.id === currentUser?.id && (
                  <button
                    className="flex items-center px-4 py-2 bg-blue-800 text-white rounded-lg shadow-md hover:bg-blue-900 hover:shadow-lg text-base transition-transform hover:scale-105 w-full"
                    onClick={openBlockDaysModal}
                  >
                    <FaLock className="mr-2 text-lg" />
                    Block Days
                  </button>
                )}
              </div>

              {/* Calendar */}
              <div className="flex-grow p-4 flex flex-col">
                {/* Calendar Header */}
                <div className="mb-4 flex justify-between items-center"> {/* Ajusta a margem */}
                  <button
                    className="flex items-center px-3 py-1 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-transform"
                    onClick={() => calendarRef.current.getApi().prev()}
                  >
                    <FaChevronLeft className="mr-1 text-lg" />
                    Prev
                  </button>

                  <button
                    className="flex items-center px-3 py-1 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-transform"
                    onClick={() => calendarRef.current.getApi().today()}
                  >
                    <FaCalendarDay className="mr-1 text-lg" />
                    Today
                  </button>

                  <button
                    className="flex items-center px-3 py-1 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-transform"
                    onClick={() => calendarRef.current.getApi().next()}
                  >
                    <FaChevronRight className="mr-1 text-lg" />
                    Next
                  </button>
                </div>

                {/* Display Current Month and Year */}
                <div className="mb-4 text-center text-xl font-semibold text-gray-800"> {/* Ajusta o tamanho do texto */}
                  {currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}
                </div>

                {/* Calendar Component */}
                <div className="flex-grow overflow-auto"> {/* Ajusta o tamanho do calendário */}
                  <FullCalendar
                    ref={calendarRef}
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    headerToolbar={false} // Hide the default header
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
                        return (
                          <span className="text-red-600 font-semibold">Blocked</span>
                        );
                      } else {
                        return <>{arg.dayNumberText}</>;
                      }
                    }}
                    eventClick={(info) => handleSelectEvent(info.event)}
                    datesSet={(dateInfo) => handleDateChange(dateInfo.view.currentStart)}
                  />
                </div>

                {selectedBlockedDay && (
                  <BlockedDayModal
                    show={true}
                    onClose={() => setSelectedBlockedDay(null)}
                    blockedDay={selectedBlockedDay}
                    selectedUser={currentUser}
                    authUserId={auth.user.id}
                    fetchBlockedDays={fetchBlockedDays}
                  />
                )}
              </div>
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
        authUserId={auth.user.id}
        selectedUser={currentUser}
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
        show={isBlockDaysModalOpen && auth.user.id === currentUser.id}
        onClose={closeBlockDaysModal}
        fetchBlockedDays={fetchBlockedDays}
        selectedUser={currentUser}
      />
    </div >
  );
}