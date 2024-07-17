import React, { useState, useEffect } from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link } from '@inertiajs/react';
import NotificationDisplay from '@/Components/NotificationDisplay';
import { FaUserCircle, FaAngleDown } from 'react-icons/fa';

// Importe o componente SearchBar
import SearchBar from '../Components/SearchBar';
// Importe o componente Agenda
import Agenda from '../Pages/Agenda'; // Verifique o caminho correto para Agenda.jsx

export default function AuthenticatedLayout({ user, children, selectedUser }) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const [events, setEvents] = useState([]); // Estado para armazenar os eventos
    const [selectedUserState, setSelectedUserState] = useState(selectedUser); // Estado local para armazenar o selectedUser

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
        <div className="min-h-screen bg-gray-100">
            <NotificationDisplay />
            <nav className="bg-gradient-to-r from-blue-600 to-blue-700 border-b border-blue-800 shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="flex-shrink-0 flex items-center">
                                <Link href="/">
                                    <FaUserCircle className="block h-9 w-auto fill-current text-white" />
                                </Link>
                            </div>

                            <div className="hidden sm:ml-10 sm:flex sm:space-x-8 text-white">
                                <NavLink
                                    className="text-white text-xl transition duration-300 ease-in-out transform hover:scale-105"
                                    href={route('agenda')}
                                    active={route().current('agenda')}
                                >
                                    Agenda
                                </NavLink>
                            </div>
                        </div>

                        <div className="hidden sm:flex sm:items-center sm:ml-6">
                            {/* Passando setEvents e setSelectedUser para o SearchBar */}
                            <SearchBar setEvents={setEvents} setSelectedUser={setSelectedUser} />

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
                                        <Dropdown.Link href={route('profile.edit')} className="block px-4 py-2 text-xl text-gray-100 hover:bg-blue-100 hover:text-blue-800">
                                            Profile
                                        </Dropdown.Link>
                                        <Dropdown.Link href={route('logout')} method="post" as="button" className="block px-4 py-2 text-xl text-gray-100 hover:bg-blue-100 hover:text-blue-800">
                                            Log Out
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        <div className="-mr-2 flex items-center sm:hidden">
                            <button
                                onClick={() => setShowingNavigationDropdown(!showingNavigationDropdown)}
                                className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-blue-800 focus:outline-none focus:bg-blue-800 focus:text-white transition duration-150 ease-in-out"
                            >
                                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    {showingNavigationDropdown ? (
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    ) : (
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M4 6h16M4 12h16M4 18h16"
                                        />
                                    )}
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>



            <Agenda auth={{ user }} selectedUser={selectedUserState} setSelectedUser={setSelectedUser} />        </div>
    );
}
