import React, { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import axios from 'axios';
import PrimaryButton from './PrimaryButton';
import SecondaryButton from './SecondaryButton';

export default function BlockDaysModal({
  show = false,
  onClose = () => { },
  onBlockDays = () => { },
  selectedUser,
}) {
  const [blockData, setBlockData] = useState({
    type: 'specific',
    specific_date: '', // Inicializa como specific_date
    start_date: '',    // Inicializa como start_date
    end_date: '',
    recurring_days: [],
    reason: '', // Inicialmente vazio
    user_id: null,
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
      reason: '', // Limpar reason ao mudar a opção, se necessário
      user_id: selectedUser ? selectedUser.id : prevBlockData.user_id, // Manter o user_id existente
    }));
  };


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBlockData((prevBlockData) => ({
      ...prevBlockData,
      [name]: value, // Isso assume que o nome é 'start_date'
    }));
  };


  const handleDaySelect = (day) => {
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

    // Verifique o estado de blockData antes de enviar
    console.log('Submitting block data:', blockData);

    try {
      const response = await axios.post('/blocked-days', blockData);
      console.log('Response:', response.data); // Log da resposta do backend
      onBlockDays(response.data);
      onClose();
    } catch (error) {
      console.error('Erro ao bloquear dias:', error);
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
                      <label className="block text-sm font-medium text-gray-700">Data Específica</label>
                      <input
                        type="date"
                        name="start_date"
                        value={blockData.specific_date}
                        onChange={handleInputChange}
                        className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
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
                      </div>
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700">Dias da Semana</label>
                        <div className="mt-2 grid grid-cols-3 gap-2">
                          {['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'].map((day, index) => (
                            <label key={index} className="flex items-center">
                              <input
                                type="checkbox"
                                value={index}
                                checked={blockData.recurring_days.includes(index)}
                                onChange={() => handleDaySelect(index)}
                                className="form-checkbox"
                              />
                              <span className="ml-2 text-sm text-gray-700">{day}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">Motivo do Bloqueio</label>
                  <input
                    type="text"
                    name="reason"
                    value={blockData.reason}
                    onChange={handleInputChange}
                    className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>

                <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                  <SecondaryButton type="button" onClick={onClose}>
                    Cancelar
                  </SecondaryButton>
                  <PrimaryButton type="submit">
                    Salvar
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
