import React, { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import { useForm } from '@inertiajs/react';

export default function AccountDeleteModal({ show = false, onClose }) {
  const { data, setData, delete: destroy, processing, errors } = useForm({
    password: '',
  });

  const handleDelete = () => {
    destroy('/profile', {
      method: 'delete',
      onSuccess: () => {
        onClose(); // Fecha o modal após a exclusão
      },
    });
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
              <div className="bg-red-50 p-6">
                <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-red-800 text-center">
                  Confirmar Exclusão
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm text-gray-500 text-center">
                    Tem certeza de que deseja excluir sua conta? Esta ação é irreversível.
                  </p>
                </div>
                <div className="mt-4">
                  <InputLabel for="password" value="Senha" />
                  <TextInput
                    id="password"
                    type="password"
                    value={data.password}
                    onChange={(e) => setData('password', e.target.value)}
                    className="mt-1 block w-full"
                  />
                  <InputError message={errors.password} className="mt-2" />
                </div>
              </div>
              <div className="bg-gray-50 p-6 flex justify-end gap-4">
                <SecondaryButton type="button" onClick={onClose} className="bg-gray-300 text-gray-800">
                  Cancelar
                </SecondaryButton>
                <PrimaryButton type="button" onClick={handleDelete} className="bg-red-600 text-white" disabled={processing}>
                  Deletar Conta
                </PrimaryButton>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
