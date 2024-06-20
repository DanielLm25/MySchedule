import React, { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import PrimaryButton from './PrimaryButton';
import SecondaryButton from './SecondaryButton';

export default function Modal({
    show = false,
    type,
    onClose = () => { },
    onEditEvent = () => { },
    onDeleteEvent = () => { },
    eventToEdit = null,
    selectedDate = '',
    onAddEvent,
    eventsForSelectedDate = [],
    labelColors,
    selectedUser, // Novo prop para receber o usuário selecionado
}) {
    const [newEvent, setNewEvent] = useState({
        title: '',
        description: '',
        time: '',
        date: selectedDate || '', // Utiliza selectedDate como valor padrão para date
        label: '',
        recurrence: '',
        days_of_week: [],
        user_id: selectedUser ? selectedUser.id : null, // Adiciona user_id ao novo evento
    });

    const [selectedColor, setSelectedColor] = useState('#378006');
    const handleColorChange = (color) => {
        setSelectedColor(color);
        console.log('Selected color changed:', color);
    };

    const [selectedRecurrence, setSelectedRecurrence] = useState('none');
    const [selectedDaysOfWeek, setSelectedDaysOfWeek] = useState([]);
    const daysOfWeekOptions = [
        { value: '1', label: 'Segunda-feira' },
        { value: '2', label: 'Terça-feira' },
        { value: '3', label: 'Quarta-feira' },
        { value: '4', label: 'Quinta-feira' },
        { value: '5', label: 'Sexta-feira' },
        { value: '6', label: 'Sábado' },
        { value: '0', label: 'Domingo' },
    ];

    useEffect(() => {
        if (eventToEdit) {
            console.log('Editing event:', eventToEdit);
            setNewEvent({
                ...eventToEdit,
                date: eventToEdit.date, // Manter a data original do evento
                days_of_week: eventToEdit.days_of_week || [],
                user_id: eventToEdit.user_id, // Manter o user_id original do evento
            });
            setSelectedRecurrence(eventToEdit.recurrence || 'none');
            setSelectedColor(eventToEdit.color || '#378006');
            setSelectedDaysOfWeek(eventToEdit.days_of_week || []);
        } else {
            console.log('Adding new event on date:', selectedDate);
            setNewEvent({
                title: '',
                description: '',
                time: '',
                date: selectedDate, // Atualiza newEvent.date com selectedDate
                label: '',
                recurrence: '',
                days_of_week: [],
                user_id: selectedUser ? selectedUser.id : null, // Atualiza user_id para o usuário selecionado
            });
            setSelectedRecurrence('none');
            setSelectedColor('#378006');
            setSelectedDaysOfWeek([]);
        }
    }, [eventToEdit, selectedDate, selectedUser]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === 'recurrence') {
            setSelectedRecurrence(value);
            // Se a recorrência selecionada for 'none' ou 'daily', limpar os dias da semana selecionados
            if (value === 'none' || value === 'daily') {
                setSelectedDaysOfWeek([]);
            }
        }

        setNewEvent((prevEvent) => ({
            ...prevEvent,
            [name]: value,
        }));

        console.log('Input change:', name, value);
    };

    const handleDateChange = (e) => {
        const { value } = e.target;
        setNewEvent((prevEvent) => ({
            ...prevEvent,
            date: value,
        }));
        console.log('Date change:', value);
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', newEvent);
        if (type === 'edit') {
            onEditEvent({ ...newEvent, color: selectedColor, recurrence: selectedRecurrence, days_of_week: selectedDaysOfWeek });
        } else {
            onAddEvent({ ...newEvent, color: selectedColor, recurrence: selectedRecurrence, days_of_week: selectedDaysOfWeek });
        }
    };

    const handleDayOfWeekChange = (e) => {
        const { value, checked } = e.target;
        if (checked) {
            setSelectedDaysOfWeek((prev) => [...prev, parseInt(value)]);
        } else {
            setSelectedDaysOfWeek((prev) => prev.filter((day) => day !== parseInt(value)));
        }
        console.log('Days of week changed:', selectedDaysOfWeek);
    };

    return (
        <Transition.Root show={show} as={Fragment}>
            <Dialog as="div" className="fixed z-10 inset-0 overflow-y-auto" onClose={onClose}>
                <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                    </Transition.Child>
                    <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
                        &#8203;
                    </span>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        enterTo="opacity-100 translate-y-0 sm:scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                        leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    >
                        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                            {type === 'initial' ? (
                                <>
                                    <div className="mt-3 text-center sm:mt-5">
                                        <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">
                                            Eventos em {selectedDate && new Date(selectedDate).toLocaleDateString()}
                                        </Dialog.Title>

                                        <div className="mt-2">
                                            {eventsForSelectedDate.length > 0 ? (
                                                eventsForSelectedDate.map((event) => (
                                                    <div key={event.id} className="mt-4">
                                                        <h4 className="text-lg font-semibold">{event.title}</h4>
                                                        <p className="text-sm">{event.description}</p>
                                                        <p className="text-sm">{event.time}</p>
                                                        <p className="text-sm">{event.recurrence}</p>
                                                        {event.recurrence === 'weekly' && (
                                                            <p className="text-sm">Ocorre {event.days_of_week.map(day => daysOfWeekOptions.find(opt => opt.value === day.toString()).label).join(', ')}</p>
                                                        )}
                                                        <div className="flex mt-2">
                                                            <button
                                                                className="px-4 py-2 bg-yellow-500 text-white rounded mr-2"
                                                                onClick={() => onEditEvent(event)}
                                                            >
                                                                Editar
                                                            </button>
                                                            <button
                                                                className="px-4 py-2 bg-red-500 text-white rounded"
                                                                onClick={() => onDeleteEvent(event.id)}
                                                            >
                                                                Deletar
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-sm text-gray-500">Nenhum evento semanal para esta data.</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                                        <SecondaryButton type="button" onClick={onClose}>
                                            Fechar
                                        </SecondaryButton>
                                        <PrimaryButton type="button" onClick={onAddEvent}>
                                            Adicionar Evento
                                        </PrimaryButton>
                                    </div>
                                </>
                            ) : (
                                <form onSubmit={handleFormSubmit}>
                                    {/* Formulário para adição/edição de eventos */}
                                    <div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Título</label>
                                            <input
                                                type="text"
                                                name="title"
                                                value={newEvent.title}
                                                onChange={handleInputChange}
                                                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                                required
                                            />
                                        </div>
                                        <div className="mt-4">
                                            <label className="block text-sm font-medium text-gray-700">Descrição</label>
                                            <textarea
                                                name="description"
                                                value={newEvent.description}
                                                onChange={handleInputChange}
                                                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                                rows="3"
                                            />
                                        </div>
                                        <div className="mt-4">
                                            <label className="block text-sm font-medium text-gray-700">Hora</label>
                                            <input
                                                type="time"
                                                name="time"
                                                value={newEvent.time}
                                                onChange={handleInputChange}
                                                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                                required
                                            />
                                        </div>
                                        {/* Condição para mostrar "Data" ou "Data de Início" */}
                                        {selectedRecurrence !== 'weekly' && (
                                            <div className="mt-4">
                                                <label className="block text-sm font-medium text-gray-700">
                                                    {selectedRecurrence === 'daily' ? 'Data de Início' : 'Data'}
                                                </label>
                                                <input
                                                    type="date"
                                                    name="date"
                                                    value={newEvent.date}
                                                    onChange={handleDateChange}
                                                    className="mt-1 p-2 border rounded-md w-full"
                                                />
                                            </div>
                                        )}
                                        <div className="mt-4">
                                            <label className="block text-sm font-medium text-gray-700">Recorrência</label>
                                            <select
                                                name="recurrence"
                                                value={selectedRecurrence}
                                                onChange={handleInputChange}
                                                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                            >
                                                <option value="none">Nenhuma</option>
                                                <option value="daily">Diária</option>
                                                <option value="weekly">Semanal</option>
                                            </select>
                                        </div>
                                        {selectedRecurrence === 'weekly' && (
                                            <div className="mt-4">
                                                <label className="block text-sm font-medium text-gray-700">Dias da Semana</label>
                                                <div className="mt-1 grid grid-cols-3 gap-2">
                                                    {daysOfWeekOptions.map((day) => (
                                                        <label key={day.value} className="flex items-center">
                                                            <input
                                                                type="checkbox"
                                                                value={day.value}
                                                                checked={selectedDaysOfWeek.includes(parseInt(day.value))}
                                                                onChange={handleDayOfWeekChange}
                                                                className="form-checkbox"
                                                            />
                                                            <span className="ml-2 text-sm text-gray-700">{day.label}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        <div className="mt-4">
                                            <label className="block text-sm font-medium text-gray-700">Cor do Evento</label>
                                            <input
                                                type="color"
                                                name="color"
                                                value={selectedColor}
                                                onChange={(e) => handleColorChange(e.target.value)}
                                                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                                        <SecondaryButton type="button" onClick={onClose}>
                                            Cancelar
                                        </SecondaryButton>
                                        <PrimaryButton type="submit">
                                            {type === 'edit' ? 'Salvar' : 'Adicionar'}
                                        </PrimaryButton>
                                    </div>
                                </form>
                            )}
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>
    );
}
