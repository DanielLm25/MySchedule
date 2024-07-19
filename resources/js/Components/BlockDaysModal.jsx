import React, { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import axios from 'axios';
import PrimaryButton from './PrimaryButton';
import SecondaryButton from './SecondaryButton';
import { FaTimes, FaUnlock } from 'react-icons/fa';


export default function BlockDaysModal({
  show = false,
  onClose = () => { },
  fetchBlockedDays,
  selectedUser,
}) {
  const [blockData, setBlockData] = useState({
    type: 'specific',
    specific_date: '',
    start_date: '',
    end_date: '',
    recurring_days: [],
    reason: '',
    user_id: null,
    specific_dates: [],
  });

  useEffect(() => {
    if (selectedUser) {
      setBlockData((prevBlockData) => ({
        ...prevBlockData,
        user_id: selectedUser.id,
      }));
    }
  }, [selectedUser]);

  const [selectedOption, setSelectedOption] = useState('specific');
  const [errors, setErrors] = useState({});

  const handleOptionChange = (e) => {
    const { value } = e.target;
    setSelectedOption(value);

    setBlockData((prevBlockData) => ({
      ...prevBlockData,
      type: value,
      specific_date: '',
      start_date: '',
      end_date: '',
      recurring_days: [],
      reason: '',
      user_id: selectedUser ? selectedUser.id : prevBlockData.user_id,
      specific_dates: [],
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBlockData((prevBlockData) => ({
      ...prevBlockData,
      [name]: value,
    }));

    if (name === 'specific_date' && blockData.type === 'specific') {
      setBlockData((prevBlockData) => ({
        ...prevBlockData,
        start_date: value,
      }));
    }
  };

  const handleRecurringDayToggle = (index) => {
    const day = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'][index];
    if (blockData.recurring_days.includes(day)) {
      setBlockData((prevBlockData) => ({
        ...prevBlockData,
        recurring_days: prevBlockData.recurring_days.filter((d) => d !== day),
      }));
    } else {
      setBlockData((prevBlockData) => ({
        ...prevBlockData,
        recurring_days: [...prevBlockData.recurring_days, day],
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    try {
      if (blockData.type === 'specific') {
        if (!blockData.specific_date || !blockData.reason) {
          setErrors({ general: 'Por favor, preencha todos os campos.' });
          return;
        }
        await axios.post('/blocked-days', {
          ...blockData,
          start_date: blockData.specific_date,
          end_date: blockData.specific_date,
        });
      } else if (blockData.type === 'range') {
        if (!blockData.start_date || !blockData.end_date || !blockData.reason) {
          setErrors({ general: 'Por favor, preencha todos os campos.' });
          return;
        }
        await axios.post('/blocked-days', blockData);
      } else if (blockData.type === 'recurring') {
        if (!blockData.recurring_days.length || !blockData.reason) {
          setErrors({ general: 'Por favor, preencha todos os campos.' });
          return;
        }
        await axios.post('/blocked-days', blockData);
      }

      await fetchBlockedDays(selectedUser.id);
      onClose();
    } catch (error) {
      console.error('Erro ao bloquear dia:', error);
      setErrors({ general: 'Ocorreu um erro ao bloquear o dia.' });
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
            <div className="inline-block align-bottom bg-blue-50 rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <form onSubmit={handleSubmit}>
                <div className="mt-4">
                  <label className="block text-xl font-medium text-gray-700">Tipo de Bloqueio</label>
                  <select
                    name="type"
                    value={selectedOption}
                    onChange={handleOptionChange}
                    className="mt-1 block w-full shadow-sm sm:text-xl border-gray-300 rounded-md"
                  >
                    <option value="specific">Dia Específico</option>
                    <option value="range">Intervalo de Dias</option>
                    <option value="recurring">Dias Recorrentes</option>
                  </select>
                </div>
                {selectedOption === 'specific' && (
                  <div className="mt-4">
                    <label className="block text-xl font-medium text-gray-700">Data</label>
                    <input
                      type="date"
                      name="specific_date"
                      value={blockData.specific_date}
                      onChange={handleInputChange}
                      className="mt-1 block w-full shadow-sm sm:text-xl border-gray-300 rounded-md"
                    />
                  </div>
                )}
                {selectedOption === 'range' && (
                  <div>
                    <div className="mt-4">
                      <label className="block text- font-medium text-gray-700">Data de Início</label>
                      <input
                        type="date"
                        name="start_date"
                        value={blockData.start_date}
                        onChange={handleInputChange}
                        className="mt-1 block w-full shadow-sm sm:text- border-gray-300 rounded-md"
                      />
                    </div>
                    <div className="mt-4">
                      <label className="block text- font-medium text-gray-700">Data de Fim</label>
                      <input
                        type="date"
                        name="end_date"
                        value={blockData.end_date}
                        onChange={handleInputChange}
                        className="mt-1 block w-full shadow-sm sm:text- border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                )}
                {selectedOption === 'recurring' && (
                  <div>
                    <fieldset className="mt-4">
                      <legend className="block text- font-medium text-gray-700">Dias Recorrentes</legend>
                      <div className="mt-2 space-y-2">
                        {['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'].map((day, index) => (
                          <div key={index} className="flex items-center">
                            <input
                              type="checkbox"
                              id={`day-${index}`}
                              checked={blockData.recurring_days.includes(day)}
                              onChange={() => handleRecurringDayToggle(index)}
                              className="h-4 w-4 border-gray-300 rounded"
                            />
                            <label htmlFor={`day-${index}`} className="ml-3 text- text-gray-600">
                              {day}
                            </label>
                          </div>
                        ))}
                      </div>
                    </fieldset>
                  </div>
                )}
                <div className="mt-4">
                  <label className="block text- font-medium text-gray-700">Motivo</label>
                  <textarea
                    name="reason"
                    value={blockData.reason}
                    onChange={handleInputChange}
                    className="mt-1 block w-full shadow-sm sm:text- border-gray-300 rounded-md"
                  />
                </div>
                {errors.general && (
                  <div className="mt-4 text- text-red-600">
                    {errors.general}
                  </div>
                )}
                <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                  <PrimaryButton type="submit" className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md transition duration-200 focus:outline-none hover:shadow-xl transition duration-300 ease-in-out transform hover:scale-105">
                    <FaUnlock className="mr-2 mb-1" /> Bloquear
                  </PrimaryButton>
                  <SecondaryButton type="button" onClick={onClose} className="flex items-center bg-blue-600 text-black px-4 py-2 rounded-md transition duration-200 focus:outline-none hover:shadow-xl transition duration-300 ease-in-out transform hover:scale-105">
                    Cancelar
                  </SecondaryButton>
                </div>
              </form>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
