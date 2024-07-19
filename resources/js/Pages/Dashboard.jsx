import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import NotificationDisplay from '../Components/NotificationDisplay'; // Importe o componente de notificação

const Dashboard = ({ auth }) => {
    return (
        <AuthenticatedLayout user={auth.user} showAgenda={true}>
            <Head title="Dashboard" />

            <div className="">
                <NotificationDisplay /> {/* Renderiza o componente de notificação */}
            </div>
        </AuthenticatedLayout>
    );
};

export default Dashboard;
