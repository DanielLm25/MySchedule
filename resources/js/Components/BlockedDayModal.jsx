import React from 'react';
import axios from 'axios';
import { FaTimes, FaUnlock } from 'react-icons/fa';

const BlockedDayModal = ({ show, onClose, blockedDay, fetchBlockedDays }) => {
  if (!show) return null;

  const handleUnblockDay = async (blockedDayId) => {
    try {
      const response = await axios.delete(`/blocked-days/${blockedDayId}`);
      console.log('Dia desbloqueado com sucesso:', response.data);

      // Chama fetchBlockedDays para atualizar a lista de dias bloqueados após desbloquear o dia
      await fetchBlockedDays(blockedDay.user_id);

      // Fechar o modal após desbloquear o dia
      onClose();
    } catch (error) {
      console.error('Erro ao desbloquear dia bloqueado:', error);
      // Tratar o erro de acordo com sua lógica de aplicação, se necessário
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen">
        {/* Overlay de fundo */}
        <div className="fixed inset-0 bg-black opacity-50"></div>

        {/* Conteúdo do modal */}
        <div className="modal-container bg-white w-11/12 md:max-w-md mx-auto rounded-lg shadow-lg z-50 overflow-y-auto">
          <div className="modal-content py-4 text-left px-6">
            {/* Cabeçalho do modal */}
            <div className="flex justify-between items-center pb-3 border-b border-gray-300">
              <p className="text-2xl font-bold text-blue-600 ml-[80px]">Blocked Day Details</p>
              {/* Botão de fechar */}
              <button onClick={onClose} className="modal-close cursor-pointer z-50 text-gray-600 hover:text-gray-900 transition duration-200">
                <FaTimes size="1.5em" />
              </button>
            </div>

            {/* Informações do dia bloqueado */}
            <div className="mt-4">
              <p className="text-lg mb-2"><span className="font-semibold text-blue-600">Blocked Day:</span> {blockedDay.start_date}</p>
              <p className="text-lg mb-4"><span className="font-semibold text-blue-600">Reason:</span> {blockedDay.reason}</p>
            </div>

            {/* Botão de desbloqueio */}
            <div className="flex justify-center">
              <button
                onClick={() => handleUnblockDay(blockedDay.id)}
                className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200 focus:outline-none hover:shadow-xl transition duration-300 ease-in-out transform hover:scale-105"
              >
                <FaUnlock className="mr-2" /> Unblock Day
              </button>
            </div>


            {/* Botão de fechar */}
            <div className="flex justify-center mt-4">
              <button
                onClick={onClose}
                className="bg-blue-900 text-white px-4 py-2 rounded-md hover:bg-blue-500 transition duration-200 focus:outline-none"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlockedDayModal;
