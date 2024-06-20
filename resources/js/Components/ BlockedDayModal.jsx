import React from 'react';

const BlockedDayModal = ({ show, onClose, blockedDay }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen">
        {/* Overlay de fundo */}
        <div className="fixed inset-0 bg-black opacity-50"></div>

        {/* Conteúdo do modal */}
        <div className="modal-container bg-white w-11/12 md:max-w-md mx-auto rounded-lg shadow-lg z-50 overflow-y-auto">
          <div className="modal-content py-4 text-left px-6">
            {/* Cabeçalho do modal */}
            <div className="flex justify-between items-center pb-3">
              <p className="text-2xl font-bold">Blocked Day Details</p>
              {/* Botão de fechar */}
              <button onClick={onClose} className="modal-close cursor-pointer z-50">
                <span className="text-3xl">&times;</span>
              </button>
            </div>

            {/* Informações do dia bloqueado */}
            <div>
              <p className="text-lg mb-2"><span className="font-semibold">Blocked Day:</span> {blockedDay.start_date}</p>
              <p className="text-lg mb-4"><span className="font-semibold">Reason:</span> {blockedDay.reason}</p>
            </div>

            {/* Botão de fechar */}
            <div className="flex justify-center">
              <button onClick={onClose} className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700 focus:outline-none">
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
