import React, { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import PrimaryButton from './PrimaryButton';
import SecondaryButton from './SecondaryButton';
import axios from 'axios';

export default function Modal({
    show = false,
    type,
    onClose = () => { },
    onEditEvent = () => { },
    onDeleteEvent = () => { },
    eventToEdit = null,
    selectedDate,
    onAddEvent,
    labelColors, // Recebendo labelColors como prop
}) {
    const [newEvent, setNewEvent] = useState({
        title: '',
        description: '',
        time: '',
        date: selectedDate || '', // Usando selectedDate como valor padrão
        label: '',
        recurrence: '',
        days_of_week: '' // Adicione o campo para armazenar a etiqueta selecionada
    });
    const [eventsForSelectedDate, setEventsForSelectedDate] = useState([]);
    const [selectedColor, setSelectedColor] = useState('#378006');
    const handleColorChange = (color) => {
        setSelectedColor(color);
    };
    const [selectedRecurrence, setSelectedRecurrence] = useState('none');
    const [daysOfWeek, setDaysOfWeek] = useState([]);

    const handleDaysOfWeekChange = (e) => {
        const value = parseInt(e.target.value);
        setDaysOfWeek(prevState =>
            e.target.checked ? [...prevState, value] : prevState.filter(day => day !== value)
        );
    };


    useEffect(() => {
        if (type === 'edit' && eventToEdit) {
            const [date, time] = eventToEdit.start ? eventToEdit.start.split('T') : ['', ''];
            setNewEvent({
                id: eventToEdit.id,
                title: eventToEdit.title || '',
                description: eventToEdit.description || '',
                time: eventToEdit.time || '00:00', // Valor padrão para o tempo
                date: eventToEdit.date || new Date().toISOString().split('T')[0], // Valor padrão para a data
                color: eventToEdit.color || '#378006' // Valor padrão para a cor
            });
            setSelectedColor(eventToEdit.color || '#378006'); // Define a cor selecionada como a cor do evento
            setSelectedRecurrence(eventToEdit.recurrence || 'none');
            setDaysOfWeek(eventToEdit.days_of_week || []);
        } else if (type === 'add') {
            setNewEvent({ title: '', description: '', time: '00:00', date: selectedDate || new Date().toISOString().split('T')[0], color: '#378006', recurrence: 'none' });
            setSelectedColor('#378006'); // Define a cor selecionada como a cor padrão
        }
    }, [eventToEdit, type, selectedDate]);

    const fetchEventsFromDatabase = async () => {
        try {
            const response = await axios.get(`/events`);
            const fetchedEvents = response.data;
            return fetchedEvents;
        } catch (error) {
            console.error('Error fetching events:', error);
            throw new Error('Failed to load events. Please try again later.');
        }
    };
    const filterEventsForSelectedDate = (fetchedEvents, selectedDate) => {
        const selectedDateObj = new Date(selectedDate);
        const selectedDateString = selectedDateObj.toISOString().split('T')[0]; // Formato YYYY-MM-DD
        const selectedDayOfWeek = selectedDateObj.getDay();

        console.log('Data selecionada:', selectedDate);
        console.log('Dia da semana selecionado:', selectedDayOfWeek);

        const filteredEvents = fetchedEvents.filter(event => {
            const eventDate = new Date(event.date);
            const eventDateString = eventDate.toISOString().split('T')[0]; // Formato YYYY-MM-DD
            console.log('Data do evento:', eventDateString);

            const isSameDate = selectedDateString === eventDateString;
            console.log('Mesma data?', isSameDate);

            if (event.days_of_week && event.days_of_week.length > 0) {
                console.log('Evento com recorrência semanal:', event);
                if (event.days_of_week.includes(selectedDayOfWeek)) {
                    console.log('Evento ocorre no dia da semana selecionado.');
                    return true;
                } else {
                    console.log('Evento não ocorre no dia da semana selecionado.');
                    return false;
                }
            } else {
                if (isSameDate || (event.recurrence === 'weekly' && selectedDayOfWeek === eventDate.getDay())) {
                    console.log('Evento ocorre na mesma data ou é semanal e ocorre no dia da semana selecionado.');
                    return true;
                } else {
                    console.log('Evento não ocorre na mesma data e não é semanal.');
                    return false;
                }
            }
        });

        return filteredEvents;
    };


    useEffect(() => {
        console.log("Modal aberto:", type); // Adicionando um log para cada modal aberto
        if (type === 'initial' && selectedDate) {
            const fetchData = async () => {
                try {
                    const fetchedEvents = await fetchEventsFromDatabase();
                    console.log('Eventos recuperados do banco de dados:', fetchedEvents); // Adicione um log para os eventos recuperados

                    const eventsForSelectedDate = filterEventsForSelectedDate(fetchedEvents, selectedDate);
                    console.log('Eventos para a data selecionada:', eventsForSelectedDate); // Adicione um log para os eventos filtrados

                    setEventsForSelectedDate(eventsForSelectedDate);
                } catch (error) {
                    console.error('Error fetching events:', error);
                    // Handle error if needed
                }
            };
            fetchData();
        }
    }, [selectedDate, type]);

    const handleCloseModal = () => {
        onClose();
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewEvent(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formattedEvent = {
            ...newEvent,
            start: `${newEvent.date}T${newEvent.time}`,
            allDay: false,
            color: selectedColor,
            recurrence: selectedRecurrence,
            days_of_week: selectedRecurrence === 'weekly' ? daysOfWeek : undefined,
        };

        // Adicione o trecho de código para formatar a hora aqui
        const formattedTime = newEvent.time.substring(0, 5);
        formattedEvent.time = formattedTime;

        if (type === 'edit') {
            onEditEvent(formattedEvent);
        } else {
            onAddEvent(formattedEvent);
        }

        handleCloseModal();
    };

    const handleDeleteEventClick = async (event) => {
        try {
            await onDeleteEvent(event.id);
            const updatedEvents = eventsForSelectedDate.filter((ev) => ev.id !== event.id);
            setEventsForSelectedDate(updatedEvents);
        } catch (error) {
            console.error('Error deleting event:', error);
        }
    };

    const handleContentClick = (e) => {
        e.stopPropagation();
    };

    const handleAddEventClick = () => {
        const updatedEvent = {
            ...newEvent,
            date: selectedDate || new Date().toISOString().split('T')[0], // Preenchendo o campo de data com selectedDate ou a data atual
        };
        setNewEvent(updatedEvent);
        onAddEvent(updatedEvent); // Chame a função onAddEvent passando o novo evento como argumento
    };




    return (
        <Transition show={show} as={Fragment}>
            <Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto" onClose={handleCloseModal}>
                <div className="min-h-screen px-4 text-center" onClick={handleCloseModal}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
                    </Transition.Child>
                    <span className="inline-block h-screen align-middle" aria-hidden="true">&#8203;</span>
                    <div className="inline-block align-middle max-w-md p-6 my-8 text-left overflow-hidden align-middle transition-all transform bg-white shadow-xl rounded-2xl" onClick={handleContentClick}>
                        <Dialog.Title as="h3" className="text-lg font-semibold mb-4">
                            {type === 'initial' ? 'Events for Selected Date' : type === 'add' ? 'Add Event' : 'Edit Event'}
                        </Dialog.Title>
                        {(type === 'add' || type === 'edit') && (
                            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                                <input
                                    type="text"
                                    name="title"
                                    placeholder="Title"
                                    value={newEvent.title}
                                    onChange={handleChange}
                                    className="px-4 py-2 border rounded-md"
                                />
                                <input
                                    type="text"
                                    name="description"
                                    placeholder="Description"
                                    value={newEvent.description}
                                    onChange={handleChange}
                                    className="px-4 py-2 border rounded-md"
                                />
                                <input
                                    type="time"
                                    name="time"
                                    value={newEvent.time}
                                    onChange={handleChange}
                                    className="px-4 py-2 border rounded-md"
                                />
                                <input
                                    type="date"
                                    name="date"
                                    value={newEvent.date}
                                    onChange={handleChange}
                                    className="px-4 py-2 border rounded-md"
                                />
                                <select
                                    value={selectedColor}
                                    onChange={(e) => handleColorChange(e.target.value)}
                                    className="px-4 py-2 border rounded-md"
                                >
                                    <option value="#378006">Green</option>
                                    <option value="#FF0000">Red</option>
                                    <option value="#0000FF">Blue</option>
                                    {/* Adicione outras opções de cores conforme necessário */}
                                </select>
                                <select
                                    value={selectedRecurrence}
                                    onChange={(e) => setSelectedRecurrence(e.target.value)}
                                    name="recurrence"
                                    className="px-4 py-2 border rounded-md"
                                >
                                    <option value="none">None</option>
                                    <option value="daily">Daily</option>
                                    <option value="weekly">Weekly</option>
                                </select>
                                {selectedRecurrence === 'weekly' && (
                                    <div className="flex flex-wrap gap-2">
                                        <label>
                                            <input
                                                type="checkbox"
                                                value={6}
                                                checked={daysOfWeek.includes(6)}
                                                onChange={handleDaysOfWeekChange}
                                            />
                                            Sunday
                                        </label>
                                        <label>
                                            <input
                                                type="checkbox"
                                                value={0}
                                                checked={daysOfWeek.includes(0)}
                                                onChange={handleDaysOfWeekChange}
                                            />
                                            Monday
                                        </label>
                                        <label>
                                            <input
                                                type="checkbox"
                                                value={1}
                                                checked={daysOfWeek.includes(1)}
                                                onChange={handleDaysOfWeekChange}
                                            />
                                            Tuesday
                                        </label>
                                        <label>
                                            <input
                                                type="checkbox"
                                                value={2}
                                                checked={daysOfWeek.includes(2)}
                                                onChange={handleDaysOfWeekChange}
                                            />
                                            Wednesday
                                        </label>
                                        <label>
                                            <input
                                                type="checkbox"
                                                value={3}
                                                checked={daysOfWeek.includes(3)}
                                                onChange={handleDaysOfWeekChange}
                                            />
                                            Thursday
                                        </label>
                                        <label>
                                            <input
                                                type="checkbox"
                                                value={4}
                                                checked={daysOfWeek.includes(4)}
                                                onChange={handleDaysOfWeekChange}
                                            />
                                            Friday
                                        </label>
                                        <label>
                                            <input
                                                type="checkbox"
                                                value={5}
                                                checked={daysOfWeek.includes(5)}
                                                onChange={handleDaysOfWeekChange}
                                            />
                                            Saturday
                                        </label>
                                    </div>
                                )}
                                <PrimaryButton type="submit">
                                    {type === 'add' ? 'Add Event' : 'Save Changes'}
                                </PrimaryButton>
                            </form>
                        )}
                        {type === 'initial' && (
                            <div>
                                {eventsForSelectedDate.length > 0 ? (
                                    eventsForSelectedDate.map(event => (
                                        <div key={event.id} className="mb-4">
                                            {console.log("Event date:", event.date)}
                                            <h4 className="text-lg font-semibold">{event.title}</h4>
                                            <p className="text-sm">{event.description}</p>
                                            <p className="text-sm">{new Date(event.start).toLocaleTimeString()}</p>
                                            <p className="text-sm" style={{ color: event.color }}>Color: {event.color}</p>
                                            <div className="flex gap-2 mt-2">
                                                <PrimaryButton onClick={() => onEditEvent(event)}>Edit</PrimaryButton>
                                                <SecondaryButton onClick={() => handleDeleteEventClick(event)}>Delete</SecondaryButton>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p>No events for this day.</p>
                                )}

                                <PrimaryButton onClick={handleAddEventClick}>Add Event</PrimaryButton>
                            </div>
                        )}
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}