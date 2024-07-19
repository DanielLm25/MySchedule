import React, { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import PrimaryButton from './PrimaryButton';
import SecondaryButton from './SecondaryButton';
import { FaEdit, FaTrashAlt, FaCalendarPlus } from 'react-icons/fa'; // Ícones para edição, exclusão e adição

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
    selectedUser,
    authUserId
}) {
    const [newEvent, setNewEvent] = useState({
        title: '',
        description: '',
        time: '',
        date: selectedDate || '',
        label: '',
        recurrence: '',
        days_of_week: [],
        user_id: selectedUser ? selectedUser.id : null,
    });

    const [selectedColor, setSelectedColor] = useState('#378006');
    const handleColorChange = (color) => {
        setSelectedColor(color);
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
            setNewEvent({
                ...eventToEdit,
                date: eventToEdit.date,
                days_of_week: eventToEdit.days_of_week || [],
                user_id: eventToEdit.user_id,
            });
            setSelectedRecurrence(eventToEdit.recurrence || 'none');
            setSelectedColor(eventToEdit.color || '#378006');
            setSelectedDaysOfWeek(eventToEdit.days_of_week || []);
        } else {
            setNewEvent({
                title: '',
                description: '',
                time: '',
                date: selectedDate,
                label: '',
                recurrence: '',
                days_of_week: [],
                user_id: selectedUser ? selectedUser.id : null,
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
            if (value === 'none' || value === 'daily') {
                setSelectedDaysOfWeek([]);
            }
        }

        setNewEvent((prevEvent) => ({
            ...prevEvent,
            [name]: value,
        }));
    };

    const handleDateChange = (e) => {
        const { value } = e.target;
        setNewEvent((prevEvent) => ({
            ...prevEvent,
            date: value,
        }));
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
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
    };

    return (
        <Transition.Root show={show} as={Fragment}>
            <Dialog as="div" className="fixed z-10 inset-0 overflow-y-auto" onClose={onClose}>
                <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Dialog.Overlay className="fixed inset-0 bg-blue-900 bg-opacity-75 transition-opacity" />
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
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            {type === 'initial' ? (
                                <>
                                    <div className="bg-blue-100 p-4 sm:p-6">
                                        <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-black text-center">
                                            Eventos em {selectedDate && new Date(selectedDate).toLocaleDateString()}
                                        </Dialog.Title>

                                        <div className="mt-4">
                                            {eventsForSelectedDate.length > 0 ? (
                                                eventsForSelectedDate.map((event) => (
                                                    <div key={event.id} className="mt-4 p-4 bg-blue-50 rounded-md shadow-sm">
                                                        <h4 className="text-lg font-semibold text-black">{event.title}</h4>
                                                        <p className="text-base text-black-700">{event.description}</p>
                                                        <p className="text-base text-black-700">{event.time}</p>
                                                        <p className="text-base text-black-700">{event.recurrence}</p>
                                                        {event.recurrence === 'weekly' && (
                                                            <p className="text-base text-black-700">
                                                                Ocorre {event.days_of_week.map(day => daysOfWeekOptions.find(opt => opt.value === day.toString()).label).join(', ')}
                                                            </p>
                                                        )}

                                                        <div className="flex flex-wrap mt-2 justify-center gap-2">
                                                            {selectedUser.id === authUserId && (
                                                                <>
                                                                    <button
                                                                        className="px-4 py-2 bg-blue-500 text-white rounded flex items-center space-x-1 hover:bg-blue-600"
                                                                        onClick={() => onEditEvent(event)}
                                                                    >
                                                                        <FaEdit className="text-lg" /> <span className="hidden sm:inline">Editar</span>
                                                                    </button>
                                                                    <button
                                                                        className="px-4 py-2 bg-red-500 text-white rounded flex items-center space-x-1 hover:bg-red-600"
                                                                        onClick={() => onDeleteEvent(event.id)}
                                                                    >
                                                                        <FaTrashAlt className="text-lg" /> <span className="hidden sm:inline">Deletar</span>
                                                                    </button>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-sm text-gray-500">Nenhum evento semanal para esta data.</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="bg-blue-50 p-4 sm:p-6 rounded-lg shadow-lg flex flex-col sm:flex-row justify-between gap-4">
                                        <SecondaryButton
                                            type="button"
                                            onClick={onClose}
                                            className="w-full sm:w-auto py-2 px-4 rounded-lg bg-white text-blue-800 font-semibold flex items-center justify-center space-x-2 transition-transform transform hover:scale-105 hover:bg-blue-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 hover:shadow-xl"
                                        >
                                            <span>Cancelar</span>
                                        </SecondaryButton>
                                        <PrimaryButton
                                            type="button"
                                            onClick={() => onAddEvent({ date: selectedDate })}
                                            className="w-full sm:w-auto py-2 px-4 rounded-lg bg-blue-500 text-white font-semibold flex items-center justify-center space-x-2 transition-transform transform hover:scale-105 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 hover:shadow-xl"
                                        >
                                            <FaCalendarPlus className="text-lg" /> <span className="hidden sm:inline">Adicionar Evento</span>
                                        </PrimaryButton>
                                    </div>
                                </>
                            ) : (
                                <div className="p-6">
                                    <form onSubmit={handleFormSubmit} className="space-y-4">
                                        <Dialog.Title as="h3" className="text-lg font-medium text-black text-center mb-4">
                                            {type === 'edit' ? 'Editar Evento' : 'Adicionar Evento'}
                                        </Dialog.Title>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Título</label>
                                            <input
                                                type="text"
                                                name="title"
                                                value={newEvent.title}
                                                onChange={handleInputChange}
                                                required
                                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Descrição</label>
                                            <textarea
                                                name="description"
                                                value={newEvent.description}
                                                onChange={handleInputChange}
                                                required
                                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Horário</label>
                                            <input
                                                type="time"
                                                name="time"
                                                value={newEvent.time}
                                                onChange={handleInputChange}
                                                required
                                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Data</label>
                                            <input
                                                type="date"
                                                name="date"
                                                value={newEvent.date}
                                                onChange={handleDateChange}
                                                required
                                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Cor</label>
                                            <input
                                                type="color"
                                                value={selectedColor}
                                                onChange={(e) => handleColorChange(e.target.value)}
                                                className="w-full h-8 border border-gray-300 rounded-md"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Recorrência</label>
                                            <select
                                                name="recurrence"
                                                value={selectedRecurrence}
                                                onChange={handleInputChange}
                                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            >
                                                <option value="none">Nenhuma</option>
                                                <option value="daily">Diária</option>
                                                <option value="weekly">Semanal</option>
                                            </select>
                                        </div>
                                        {selectedRecurrence === 'weekly' && (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Dias da Semana</label>
                                                <div className="grid grid-cols-2 gap-2">
                                                    {daysOfWeekOptions.map((day) => (
                                                        <div key={day.value} className="flex items-center">
                                                            <input
                                                                type="checkbox"
                                                                value={day.value}
                                                                checked={selectedDaysOfWeek.includes(parseInt(day.value))}
                                                                onChange={handleDayOfWeekChange}
                                                                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                            />
                                                            <label className="ml-2 text-sm text-gray-700">{day.label}</label>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        <div className="flex justify-end space-x-2">
                                            <SecondaryButton
                                                type="button"
                                                onClick={onClose}
                                                className="w-full sm:w-auto py-2 px-4 rounded-lg bg-white text-blue-800 font-semibold flex items-center justify-center space-x-2 transition-transform transform hover:scale-105 hover:bg-blue-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 hover:shadow-xl hover:text-black"
                                            >
                                                Cancelar
                                            </SecondaryButton>
                                            <PrimaryButton
                                                type="submit"
                                                className="w-full sm:w-auto py-2 px-4 rounded-lg bg-blue-500 text-white font-semibold flex items-center justify-center space-x-2 transition-transform transform hover:scale-105 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 hover:shadow-xl"
                                            >
                                                {type === 'edit' ? 'Salvar Alterações' : 'Adicionar Evento'}
                                            </PrimaryButton>
                                        </div>
                                    </form>
                                </div>
                            )}
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>
    );
}
