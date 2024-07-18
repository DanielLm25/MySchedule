import React, { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import axios from 'axios';
import PrimaryButton from './PrimaryButton';
import SecondaryButton from './SecondaryButton';

export default function BlockDaysModal({
  show = false,
  onClose = () => { },
  fetchBlockedDays, // Função para buscar os dias bloqueados
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

    // Limpar campos específicos quando a opção muda
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

    // Preencher start_date com specific_date se type for 'specific'
    if (name === 'specific_date' && blockData.type === 'specific') {
      setBlockData((prevBlockData) => ({
        ...prevBlockData,
        start_date: value,
      }));
    }
  };

  const handleDaySelect = (day) => {
    if (blockData.specific_dates.includes(day)) {
      setBlockData((prevBlockData) => ({
        ...prevBlockData,
        specific_dates: prevBlockData.specific_dates.filter((d) => d !== day),
      }));
    } else {
      setBlockData((prevBlockData) => ({
        ...prevBlockData,
        specific_dates: [...prevBlockData.specific_dates, day],
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

    // Validar se specific_dates está vazio se a opção específica estiver selecionada
    if (selectedOption === 'specific' && !blockData.specific_date) {
      setErrors({ specific_date: 'Selecione uma data específica.' });
      return;
    }

    try {
      // Validar se start_date está preenchido se a opção for range ou recurring
      if ((selectedOption === 'range' || selectedOption === 'recurring') && !blockData.start_date) {
        setErrors({ start_date: 'A data de início é necessária.' });
        return;
      }

      // Prepara os dados a serem enviados
      const requestData = {
        type: blockData.type,
        start_date: blockData.start_date,
        end_date: blockData.end_date,
        recurring_days: blockData.recurring_days,
        reason: blockData.reason,
        user_id: blockData.user_id,
        specific_dates: blockData.specific_dates,
        specific_date: blockData.specific_date,
      };

      const response = await axios.post('/blocked-days', requestData);

      console.log('Response:', response.data);

      // Chama a função para buscar os dias bloqueados após adicionar novos bloqueios
      fetchBlockedDays();

      onClose();
    } catch (error) {
      console.error('Error blocking days:', error.response ? error.response.data : error.message);
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
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <form onSubmit={handleSubmit}>
                <div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700">Tipo de Bloqueio</label>
                    <select
                      name="type"
                      value={selectedOption}
                      onChange={handleOptionChange}
                      className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    >
                      <option value="specific">Dia Específico</option>
                      <option value="range">Intervalo de Dias</option>
                      <option value="recurring">Dias Recorrentes</option>
                    </select>
                  </div>
                  {selectedOption === 'specific' && (
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700">Selecione a Data</label>
                      <input
                        type="date"
                        name="specific_date"
                        value={blockData.specific_date}
                        onChange={handleInputChange}
                        className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                      {errors.specific_date && (
                        <p className="mt-1 text-sm text-red-600">{errors.specific_date}</p>
                      )}
                    </div>
                  )}
                  {selectedOption === 'range' && (
                    <>
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700">Data de Início</label>
                        <input
                          type="date"
                          name="start_date"
                          value={blockData.start_date}
                          onChange={handleInputChange}
                          className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                        {errors.start_date && (
                          <p className="mt-1 text-sm text-red-600">{errors.start_date}</p>
                        )}
                      </div>
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700">Data de Fim</label>
                        <input
                          type="date"
                          name="end_date"
                          value={blockData.end_date}
                          onChange={handleInputChange}
                          className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </>
                  )}
                  {selectedOption === 'recurring' && (
                    <div>
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700">Data de Início</label>
                        <input
                          type="date"
                          name="start_date"
                          value={blockData.start_date}
                          onChange={handleInputChange}
                          className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                        {errors.start_date && (
                          <p className="mt-1 text-sm text-red-600">{errors.start_date}</p>
                        )}
                      </div>
                      <div className="mt-4">
                        <span className="block text-sm font-medium text-gray-700 mb-1">Dias da Semana</span>
                        <div className="flex flex-wrap gap-4">
                          {['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'].map((day, index) => (
                            <button
                              key={index}
                              type="button"
                              onClick={() => handleRecurringDayToggle(index)}
                              className={`px-3 py-1 text-sm rounded-md focus:outline-none ${blockData.recurring_days.includes(day)
                                  ? 'bg-blue-500 text-white'
                                  : 'bg-gray-200 text-gray-700'
                                }`}
                            >
                              {day}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700">Motivo</label>
                    <textarea
                      name="reason"
                      value={blockData.reason}
                      onChange={handleInputChange}
                      className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      rows="3"
                    />
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <SecondaryButton onClick={onClose} type="button">
                    Cancelar
                  </SecondaryButton>
                  <PrimaryButton type="submit" className="ml-2">
                    Bloquear Dias
                  </PrimaryButton>
                </div>
              </form>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
