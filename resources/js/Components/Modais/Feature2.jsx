import React from 'react';
import { FaLightbulb, FaLock, FaTimes } from 'react-icons/fa';

const Feature2Modal = ({ isOpen, onClose }) => {
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 transition-opacity" aria-hidden="true">
            <div className="absolute inset-0 bg-gray-900 opacity-75"></div>
          </div>
          <div className="relative bg-blue-600 rounded-lg p-6 max-w-full sm:max-w-md md:max-w-lg lg:max-w-2xl mx-auto shadow-2xl transform transition-all duration-500 max-h-screen overflow-y-auto">
            <button
              className="absolute top-4 right-4 text-gray-700 hover:text-gray-900 transition duration-300 focus:outline-none"
              onClick={onClose}
            >
              <FaTimes className="text-2xl text-white" />
            </button>
            <div className="flex flex-col md:flex-row items-center justify-center h-full space-y-6 md:space-y-0 md:space-x-6">
              <div className="bg-gradient-to-r from-blue-700 to-blue-500 p-6 md:p-8 rounded-full shadow-lg flex items-center justify-center">
                <FaLock className="text-white" style={{ fontSize: '4rem' }} />
              </div>
              <div className="text-white text-center md:text-left">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Feature 2 Modal</h2>
                <p className="text-base md:text-lg mb-4">
                  Detailed information about Feature 2 goes here. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi.
                </p>
                <p className="text-sm md:text-base">
                  Donec vel libero at lectus rutrum vestibulum vitae ut turpis. In eu libero ligula. Fusce vestibulum finibus ante non efficitur.
                </p>
                <button
                  className="text-black mt-6 bg-white hover:bg-blue-800 hover:text-white py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out"
                  onClick={onClose}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Feature2Modal;
