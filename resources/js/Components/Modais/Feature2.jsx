// Components/Modais/Feature3.jsx

import React from 'react';
import { FaTimes, FaLock } from 'react-icons/fa';

const Feature2Modal = ({ isOpen, onClose }) => {
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center">
          <div className="fixed inset-0 transition-opacity" aria-hidden="true">
            <div className="absolute inset-0 bg-gray-900 opacity-75"></div>
          </div>
          <div className="relative bg-gray-200 rounded-lg p-6 w-full max-w-3xl mx-auto shadow-2xl transform transition-all duration-500" style={{ height: '30vh' }}>
            <button
              className="absolute top-4 right-4 text-gray-700 hover:text-gray-900 transition duration-300 focus:outline-none"
              onClick={onClose}
            >
              <FaTimes className="text-2xl" />
            </button>
            <div className="flex items-center justify-center h-full">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-full shadow-lg">
                <FaLock className="text-white" style={{ fontSize: '8rem' }} />
              </div>
              <div className="ml-6">
                <h2 className="text-4xl font-bold mb-2 text-gray-800">Feature 3 Modal</h2>
                <p className="text-lg text-gray-700 mb-2">
                  Detailed information about Feature 3 goes here. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi.
                </p>
                <p className="text-md text-gray-600">
                  Donec vel libero at lectus rutrum vestibulum vitae ut turpis. In eu libero ligula. Fusce vestibulum finibus ante non efficitur.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Feature2Modal;
