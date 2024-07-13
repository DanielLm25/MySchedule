import React from 'react';
import { FaLightbulb, FaTimes } from 'react-icons/fa';

const Feature1Modal = ({ isOpen, onClose }) => {
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center">
          <div className="fixed inset-0 transition-opacity" aria-hidden="true">
            <div className="absolute inset-0 bg-gray-900 opacity-75"></div>
          </div>
          <div className="relative border-2 border-white bg-blue-600 rounded-lg p-6 w-full max-w-2xl mx-auto shadow-2xl transform transition-all duration-500" style={{ height: '50vh' }}>
            <button
              className="absolute top-4 right-4 text-gray-700 hover:text-gray-900 transition duration-300 focus:outline-none"
              onClick={onClose}
            >
              <FaTimes className="text-2xl text-white" />
            </button>
            <div className="flex items-center justify-center h-full">
              <div className="bg-gradient-to-r from-blue-700 to-blue-500 p-8 rounded-full shadow-lg">
                <FaLightbulb className="text-white" style={{ fontSize: '8rem' }} />
              </div>
              <div className="ml-10 text-white">
                <h2 className="text-5xl font-bold mb-4">Feature 1 Modal</h2>
                <p className="text-lg mb-4">
                  Detailed information about Feature 1 goes here. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi.
                </p>
                <p className="text-base">
                  Donec vel libero at lectus rutrum vestibulum vitae ut turpis. In eu libero ligula. Fusce vestibulum finibus ante non efficitur.
                </p>
                <button
                  className="text-black mt-6 bg-white hover:bg-blue-800 hover:text-white py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out"
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

export default Feature1Modal;
