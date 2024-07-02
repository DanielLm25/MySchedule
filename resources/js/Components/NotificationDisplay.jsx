import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const NotificationDisplay = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const echo = window.Echo;

    echo.channel('events') // Altere para echo.private('events') se for um canal privado
      .listen('EventFound', (event) => {
        handleEventFound(event);
      });

    return () => {
      echo.leaveChannel('events'); // Altere para echo.leaveChannel('private-events') se for um canal privado
    };
  }, []);

  const handleEventFound = (event) => {
    try {
      const parsedEvent = event;
      setEvents((prevEvents) => [...prevEvents, parsedEvent]);

      toast.info(
        <div key={parsedEvent.id} className="p-4">
          <h3 className="text-lg font-bold mb-2">Novo Evento:</h3>
          <p className="text-sm"><strong>Nome:</strong> {parsedEvent.title}</p>
          <p className="text-sm"><strong>Descrição:</strong> {parsedEvent.description}</p>
          <p className="text-sm"><strong>Data:</strong> {parsedEvent.date}</p>
          <p className="text-sm"><strong>Hora:</strong> {parsedEvent.time}</p>
          <button
            className="mt-4 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-700 transition duration-300"
            onClick={() => handleDeleteEvent(parsedEvent.id)}
          >
            Concluir
          </button>
        </div>,
        {
          position: 'top-right',
          autoClose: false,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          className: 'bg-gray-800 text-white rounded-lg shadow-lg',
          bodyClassName: 'text-sm',
        }
      );
    } catch (error) {
      console.error('Error handling event data:', error);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      const response = await axios.delete(`/events/${eventId}`);
      setEvents((prevEvents) => prevEvents.filter(event => event.id !== eventId));
      toast.dismiss();
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error('Erro ao deletar o evento.');
    }
  };

  return (
    <div>
      <ToastContainer />
    </div>
  );
};

export default NotificationDisplay;
