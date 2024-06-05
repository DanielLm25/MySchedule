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
    onAddEvent
}) {
    const [newEvent, setNewEvent] = useState({
        title: '',
        description: '',
        time: '',
        date: selectedDate || ''
    });
    const [eventsForSelectedDate, setEventsForSelectedDate] = useState([]);
    const labelColors = {
        personal: '#FFD700', // Amarelo
        work: '#4169E1',     // Azul
        school: '#32CD32',   // Verde
        // Adicione outras etiquetas e suas cores conforme necessário
    };

    useEffect(() => {
        if (type === 'edit' && eventToEdit) {
            // Se o tipo for 'edit' e houver um evento para editar, preencha os dados do evento no estado
            setNewEvent({
                id: eventToEdit.id,
                title: eventToEdit.title || '',
                description: eventToEdit.description || '',
                time: eventToEdit.time, // Mantenha o mesmo formato do tempo recuperado
                date: eventToEdit.date
            });

            // Log dos dados recuperados
            console.log('Dados recuperados do evento:', {
                id: eventToEdit.id,
                title: eventToEdit.title || '',
                description: eventToEdit.description || '',
                time: eventToEdit.time,
                date: eventToEdit.date
            });
        } else if (type === 'add') {
            // Se o tipo for 'add', limpe os campos
            setNewEvent({ title: '', description: '', time: '', date: selectedDate });
        }
    }, [eventToEdit, type, selectedDate]);

    // Função para buscar eventos do banco de dados com base na data selecionada
    const fetchEventsFromDatabase = async () => {
        try {
            const response = await axios.get(`/events?date=${selectedDate}`);
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar eventos no banco de dados:', error);
            throw new Error('Falha ao carregar eventos. Por favor, tente novamente mais tarde.');
        }
    };

    useEffect(() => {
        if (type === 'initial' && selectedDate) {
            const fetchData = async () => {
                try {
                    const fetchedEvents = await fetchEventsFromDatabase();
                    // Verifica se a data selecionada corresponde à data de algum dos eventos
                    const eventsForSelectedDate = fetchedEvents.filter(event => event.date === selectedDate);
                    if (eventsForSelectedDate.length > 0) {
                        setEventsForSelectedDate(eventsForSelectedDate);
                    } else {
                        setEventsForSelectedDate([]);
                    }
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

        // Existing logic to format time...
        const formattedTime = newEvent.time.split(':').slice(0, 2).join(':');

        // Update state with formatted time
        setNewEvent(prevState => ({
            ...prevState,
            time: formattedTime,
        }));

        // Rest of your form submission logic...
        if (type === 'edit') {
            onEditEvent(newEvent);
        } else {
            onAddEvent(newEvent);
        }

        handleCloseModal();
    }

    const handleDeleteEventClick = (event) => {
        onDeleteEvent(event.id);
        handleCloseModal();
    };

    const handleContentClick = (e) => {
        e.stopPropagation();
    };

    const handleAddEventClick = () => {
        onAddEvent();
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
                                    name="label"
                                    value={newEvent.label}
                                    onChange={handleChange}
                                    className="px-4 py-2 border rounded-md"
                                >
                                    {Object.keys(labelColors).map(label => (
                                        <option key={label} value={label} style={{ color: labelColors[label] }}>{label}</option>
                                    ))}
                                </select>
                                <div className="mt-6 text-right">
                                    <PrimaryButton onClick={handleCloseModal} className="mr-2">Close</PrimaryButton>
                                    <PrimaryButton type="submit">Save Event</PrimaryButton>
                                </div>
                            </form>
                        )}
                        {type === 'initial' && (
                            <div className="flex flex-col gap-4">
                                {eventsForSelectedDate.length > 0 ? (
                                    <ul>
                                        {eventsForSelectedDate.map(event => (
                                            <li key={event.id} className="mb-2 flex justify-between items-center">
                                                <div>
                                                    <div className="font-semibold">{event.title}</div>
                                                    <div>{event.description}</div>
                                                    <div>{event.time}</div>
                                                </div>
                                                <div>
                                                    <PrimaryButton onClick={() => onEditEvent(event)}>Edit</PrimaryButton>
                                                    <SecondaryButton onClick={() => handleDeleteEventClick(event)}>Delete</SecondaryButton>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <div className="text-gray-500">No events for this date.</div>
                                )}
                                <div className="mt-6 text-right">
                                    <PrimaryButton onClick={handleCloseModal} className="mr-2">Close</PrimaryButton>
                                    <PrimaryButton onClick={handleAddEventClick} className="mr-2">Add Event</PrimaryButton>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
