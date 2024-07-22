import React, { useState } from 'react';
import DangerButton from '@/Components/DangerButton';
import AccountDeleteModal from '../../../Components/Modais/AccountDeleteModal';

export default function DeleteUserForm({ className = '' }) {
    const [confirmingAccountDeletion, setConfirmingAccountDeletion] = useState(false);

    const confirmAccountDeletion = () => {
        setConfirmingAccountDeletion(true);
    };

    const closeModal = () => {
        setConfirmingAccountDeletion(false);
    };

    return (
        <section className={`space-y-6 ${className}`}>
            <header>
                <h2 className="text-lg font-medium text-gray-900">Deletar Conta</h2>
                <p className="mt-1 text-sm text-gray-600">
                    Depois que sua conta for excluída, todos os seus recursos e dados serão excluídos permanentemente.
                    Antes de excluir sua conta, baixe quaisquer dados ou informações que você deseja reter.
                </p>
            </header>

            <DangerButton onClick={confirmAccountDeletion}>Deletar Conta</DangerButton>

            <AccountDeleteModal show={confirmingAccountDeletion} onClose={closeModal} />
        </section>
    );
}
