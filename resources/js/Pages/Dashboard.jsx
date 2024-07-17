import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import NotificationDisplay from '../Components/NotificationDisplay'; // Importe o componente de notificação

const Dashboard = ({ auth }) => {
    return (
        <AuthenticatedLayout
            user={auth.user}
        >
            <Head title="Dashboard2" />

            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">

            </div>
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 mt-8">

                <div className="">
                    <NotificationDisplay /> {/* Renderiza o componente de notificação */}
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default Dashboard;
