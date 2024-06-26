import { useEffect, useState } from 'react';
import axios from 'axios';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard({ auth }) {
    const [eventCount, setEventCount] = useState(0);

    useEffect(() => {
        const fetchEventCount = async () => {
            try {
                const response = await axios.get('/event-count'); // Endpoint para consultar eventos
                setEventCount(response.data.count); // Atualiza o estado com o número de eventos recebidos
            } catch (error) {
                console.error('Erro ao buscar eventos:', error);
            }
        };

        fetchEventCount();
    }, []);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">You're logged in!</div>
                        <p>Total Events: {eventCount}</p>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
