import React, { useState, useEffect } from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link } from '@inertiajs/react';
import NotificationDisplay from '@/Components/NotificationDisplay';
import { FaUserCircle, FaAngleDown } from 'react-icons/fa';
import SearchBar from '../Components/SearchBar';
import Agenda from '../Pages/Agenda'; // Verifique o caminho correto para Agenda.jsx
import Footer from '../Components/Footer'; // Importe o componente Footer

export default function AuthenticatedLayout({ user, children, selectedUser, showAgenda }) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const [events, setEvents] = useState([]); // Estado para armazenar os eventos
    const [selectedUserState, setSelectedUserState] = useState(selectedUser); // Estado local para armazenar o selectedUser
    const isMobile = window.innerWidth < 640; // Ajuste o breakpoint conforme necessário
    // Efeito para atualizar o selectedUserState quando selectedUser mudar
    useEffect(() => {
        setSelectedUserState(selectedUser);
    }, [selectedUser]);

    // Função para atualizar o estado de selectedUser
    const setSelectedUser = (user) => {
        console.log('Selected user set:', user);
        setSelectedUserState(user); // Atualiza o estado selectedUserState
    };

    // Log para verificar o selectedUser sempre que ele mudar
    console.log('selectedUser:', selectedUserState);

    // Log para verificar a passagem de selectedUser para os componentes filhos
    useEffect(() => {
        console.log('Children props:', children.props);
    }, [selectedUserState, children]);

    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-200 via-blue-300 to-blue-400">
            <NotificationDisplay />
            <nav className="bg-gradient-to-r from-blue-600 to-blue-700 border-b border-blue-800 shadow-lg">
                <div className="max-w-[1395px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="flex-shrink-0 flex items-center">
                                <Link href={isMobile ? route('dashboard') : '/'}>
                                    <FaUserCircle className="block h-9 w-auto fill-current text-white" />
                                </Link>
                            </div>

                            <div className="hidden sm:ml-10 sm:flex sm:space-x-8 text-white">
                                <NavLink
                                    className="text-white text-xl transition duration-300 ease-in-out transform hover:scale-105"
                                    href={route('dashboard')}
                                    active={route().current('dashboard')}
                                >
                                    Agenda
                                </NavLink>
                            </div>
                        </div>

                        {/* Container centralizado para a SearchBar */}
                        <div className="flex-grow flex justify-center">
                            <div className="w-full max-w-2xl mt-2">
                                <SearchBar className="w-full" setEvents={setEvents} setSelectedUser={setSelectedUser} />
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            <div className="ml-3 relative">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <button
                                            type="button"
                                            className="text-xl inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 hover:text-white focus:outline-none focus:border-blue-700 focus:ring-blue-700 focus:text-white transition duration-150 ease-in-out"
                                        >
                                            {user.name}
                                            <FaAngleDown className="ml-1 mt-1" />
                                        </button>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content className="bg-white">
                                        <Dropdown.Link href={route('profile.edit')} className="bg-white block px-4 py-2 text-xl text-blue-200 text-gray-100 hover:bg-blue-100 hover:text-blue-800">
                                            Profile
                                        </Dropdown.Link>
                                        <Dropdown.Link href={route('logout')} method="post" as="button" className="bg-white block px-4 py-2 text-xl text-blue-200 hover:bg-blue-100 hover:text-blue-800">
                                            Log Out
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <main>
                {showAgenda && (
                    <Agenda auth={{ user }} selectedUser={selectedUserState} setSelectedUser={setSelectedUser} />
                )}
                {children}
                <Footer />
            </main>

            {/* Adicione o Footer aqui */}
        </div>
    );
}
