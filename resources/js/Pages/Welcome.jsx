// pages/Welcome.js

import { Link, Head } from '@inertiajs/react';
import { FaUserCircle, FaSignInAlt, FaUserPlus, FaTachometerAlt, FaLightbulb, FaLock, FaUserFriends } from 'react-icons/fa';
import { useState } from 'react';
import { useInView } from 'react-intersection-observer';
import Feature1Modal from '../Components/Modais/Feature1';
import Feature2Modal from '../Components/Modais/Feature2';
import Feature3Modal from '../Components/Modais/Feature3';
import Footer from '../Components/Footer'; // Importe o componente Footer

const FeatureCard = ({ icon, title, description, onLearnMore }) => {
    const { ref, inView } = useInView({
        triggerOnce: true,
        threshold: 0.5,
    });

    return (
        <div
            ref={ref}
            className={`relative p-6 md:p-10 bg-blue-900 text-white rounded-lg shadow-xl transform transition duration-500 hover:scale-105 hover:bg-blue-800 hover:shadow-2xl group flex flex-col justify-between ${inView ? 'animate-slideDown' : 'opacity-0 translate-y-10'}`}
        >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-800 to-blue-700 opacity-0 group-hover:opacity-100 transition duration-500 rounded-lg"></div>
            <div className="z-10 flex items-center space-x-4">
                {icon}
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold group-hover:text-white">{title}</h2>
            </div>
            <p className="relative z-10 mt-4 text-base md:text-xl group-hover:text-white">
                {description}
            </p>
            <button
                className="relative z-10 mt-4 bg-gradient-to-r from-blue-500 to-blue-500 hover:from-blue-100 hover:to-blue-100 hover:text-blue-900 px-6 py-2 md:px-8 md:py-3 rounded-md text-base md:text-xl font-semibold transition duration-300"
                onClick={onLearnMore}
            >
                Learn More
            </button>
        </div>
    );
};

export default function Welcome({ auth }) {
    const [isFeature1ModalOpen, setIsFeature1ModalOpen] = useState(false);
    const [isFeature2ModalOpen, setIsFeature2ModalOpen] = useState(false);
    const [isFeature3ModalOpen, setIsFeature3ModalOpen] = useState(false);

    const openFeature1Modal = () => setIsFeature1ModalOpen(true);
    const closeFeature1Modal = () => setIsFeature1ModalOpen(false);
    const openFeature2Modal = () => setIsFeature2ModalOpen(true);
    const closeFeature2Modal = () => setIsFeature2ModalOpen(false);
    const openFeature3Modal = () => setIsFeature3ModalOpen(true);
    const closeFeature3Modal = () => setIsFeature3ModalOpen(false);

    return (
        <>
            <Head title="Welcome" />
            <div className="bg-black text-black/70 dark:text-white/70">
                <div className="fixed top-0 left-0 right-0 z-50 bg-black bg-opacity-70 w-full">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center py-4 border-b border-gray-300">
                            <div className="flex items-center space-x-2">
                                <div className="w-15 h-15"> {/* Ajuste o tamanho conforme necessário */}
                                    <svg
                                        version="1.0"
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="80"
                                        height="80"
                                        viewBox="0 0 200.000000 200.000000"
                                        preserveAspectRatio="xMidYMid meet"
                                    >
                                        <g
                                            transform="translate(0.000000,200.000000) scale(0.100000,-0.100000)"
                                            fill="#fff"
                                            stroke="none"
                                        >
                                            <path d="M92 993 l3 -918 905 0 905 0 3 918 2 917 -910 0 -910 0 2 -917z
                    m1758 -3 l0 -850 -850 0 -850 0 0 850 0 850 850 0 850 0 0 -850z"/>
                                            <path d="M575 1678 c-3 -7 -4 -229 -3 -493 l3 -480 95 0 95 0 5 309 5 310 250
                    -312 249 -313 76 3 75 3 0 490 0 490 -95 0 -95 0 -5 -315 -5 -314 -252 317
                    -253 317 -70 0 c-47 0 -72 -4 -75 -12z"/>
                                            <path d="M330 401 c0 -101 2 -121 15 -121 12 0 15 17 15 96 l0 97 63 -97 c87
                    -134 97 -131 97 24 0 100 -2 120 -15 120 -12 0 -15 -18 -15 -97 l0 -98 -63 95
                    c-34 52 -70 96 -80 98 -15 3 -17 -8 -17 -117z"/>
                                            <path d="M612 495 c-48 -40 -55 -129 -14 -183 22 -28 75 -42 120 -30 85 22
                    100 183 21 224 -43 22 -93 18 -127 -11z m139 -42 c5 -13 9 -42 9 -64 0 -70
                    -72 -114 -123 -75 -39 30 -44 128 -9 159 38 33 107 22 123 -20z"/>
                                            <path d="M817 514 c-13 -13 5 -24 39 -24 l34 0 0 -105 c0 -87 3 -105 15 -105
                    12 0 15 18 15 104 l0 105 35 3 c20 2 35 8 35 13 0 11 -162 20 -173 9z"/>
                                            <path d="M1050 413 c-23 -60 -44 -114 -47 -120 -3 -7 2 -13 10 -13 9 0 20 15
                    27 35 11 34 13 35 61 35 48 0 51 -2 65 -35 8 -19 21 -35 29 -35 12 0 11 9 -6
                    53 -12 28 -33 82 -48 120 -14 37 -31 67 -38 67 -6 0 -30 -48 -53 -107z m84
                    -11 c7 -20 4 -22 -28 -22 -41 0 -41 0 -19 58 l16 43 12 -28 c7 -16 16 -39 19
                    -51z"/>
                                            <path d="M1210 505 c0 -11 11 -15 40 -15 l40 0 0 -105 c0 -87 3 -105 15 -105
                    12 0 15 18 15 105 l0 105 35 0 c24 0 35 5 35 15 0 12 -17 15 -90 15 -73 0 -90
                    -3 -90 -15z"/>
                                            <path d="M1430 401 c0 -102 2 -121 15 -121 13 0 15 17 13 117 -2 82 -7 118
                    -15 121 -10 3 -13 -25 -13 -117z"/>
                                            <path d="M1559 505 c-36 -19 -53 -65 -47 -125 6 -57 27 -87 72 -98 97 -25 168
                    56 137 158 -21 71 -96 101 -162 65z m113 -32 c37 -33 29 -141 -12 -163 -57
                    -30 -120 11 -120 79 0 53 17 88 49 100 30 11 59 5 83 -16z"/>
                                        </g>
                                    </svg>
                                </div>
                            </div>

                            <nav className="flex space-x-4">
                                {auth.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="flex items-center space-x-1 text-white text-base sm:text-[25px] px-3 py-2 rounded-md transition duration-300 hover:text-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                                    >
                                        <FaUserFriends />
                                        <span>Agenda</span>
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={route('login')}
                                            className="flex items-center space-x-1 text-white text-base sm:text-xl px-3 py-2 rounded-md transition duration-300 hover:text-[#4D4DFF] focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                                        >
                                            <FaSignInAlt />
                                            <span>Log in</span>
                                        </Link>
                                        <Link
                                            href={route('register')}
                                            className="flex items-center space-x-1 text-white text-base sm:text-xl px-3 py-2 rounded-md transition duration-300 hover:text-[#4D4DFF] focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                                        >
                                            <FaUserPlus />
                                            <span>Register</span>
                                        </Link>
                                    </>
                                )}
                            </nav>
                        </div>
                    </div>
                </div>

                {/* First section with background image and centered text */}
                <section className="relative h-screen bg-cover bg-center bg-no-repeat">
                    <div className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                        style={{
                            backgroundImage: 'url("/images/countdown-begins-antique-timer-sand-flowing-endlessly-generated-by-ai-2.jpg")',
                            filter: 'brightness(90%) saturate(180%) blur(4px)',  // Adds a 4px blur effect
                        }}
                    ></div>
                    <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                    <div className="relative flex items-center justify-center text-center h-full px-4 sm:px-6 lg:px-8">
                        <div className="max-w-3xl lg:max-w-6xl mx-auto px-4">
                            <header className="py-12 text-center">
                                <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-poppins font-extrabold text-white mb-6">
                                    Bem-vindo ao <span className="text-primary">NOTATIO</span>
                                </h1>
                                <p className="text-lg md:text-xl lg:text-2xl xl:text-3xl text-gray-300">
                                    Sua ferramenta definitiva para gerenciar compromissos com eficiência e estilo.
                                </p>
                            </header>
                        </div>

                    </div>
                </section>

                <section className="py-12 bg-gradient-to-r from-[#000000] to-[#000042] flex items-center justify-center min-h-screen">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold font-poppins mb-12 sm:mb-16 lg:mb-24 text-white">
                            Funcionalidades do NOTATIO
                        </h1>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                            {/* Card 1 */}
                            <FeatureCard
                                icon={<FaLightbulb className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-blue-300 mb-4" />}
                                title="Personalize Seus Eventos"
                                description="Customize cada evento para refletir seu estilo pessoal e preferências. Torne sua agenda tão única quanto você."
                                onLearnMore={openFeature1Modal}
                                className="flex flex-col items-center text-center p-6 bg-gray-800 rounded-lg shadow-lg"
                                titleClassName="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-white mb-2"
                                descriptionClassName="text-sm sm:text-base md:text-lg lg:text-xl text-gray-200"
                            />

                            {/* Card 2 */}
                            <FeatureCard
                                icon={<FaLock className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-blue-300 mb-4" />}
                                title="Privacidade"
                                description="Controle quem pode ver e editar suas informações. Defina permissões específicas para manter seus dados pessoais seguros."
                                onLearnMore={openFeature2Modal}
                                className="flex flex-col items-center text-center p-6 bg-gray-800 rounded-lg shadow-lg"
                                titleClassName="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-white mb-2"
                                descriptionClassName="text-sm sm:text-base md:text-lg lg:text-xl text-gray-200"
                            />

                            {/* Card 3 */}
                            <FeatureCard
                                icon={<FaUserFriends className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-blue-300 mb-4" />}
                                title="Network"
                                description="Compartilhe sua agenda com amigos, familiares e colegas de trabalho para uma colaboração eficiente e um planejamento mais integrado."
                                onLearnMore={openFeature3Modal}
                                className="flex flex-col items-center text-center p-6 bg-gray-800 rounded-lg shadow-lg"
                                titleClassName="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-white mb-2"
                                descriptionClassName="text-sm sm:text-base md:text-lg lg:text-xl text-gray-200"
                            />
                        </div>
                    </div>
                </section>


                <section className="py-12 bg-black text-white flex items-center justify-center min-h-screen mt-20">
                    <div className="max-w-2xl mx-auto text-center px-4">
                        <h2 className="text-3xl md:text-4xl lg:text-6xl font-bold font-poppins mb-6">Junte-se a Nós</h2>
                        <p className="text-sm md:text-base lg:text-lg text-gray-300 mb-8">
                            Experimente todas as vantagens do nosso serviço.
                        </p>
                        <div className="flex flex-col sm:flex-row sm:space-x-4 justify-center space-y-4 sm:space-y-0">
                            <Link
                                href={route('login')}
                                className="flex items-center space-x-2 bg-white text-black hover:bg-gray-200 px-6 py-3 rounded-full transition duration-300 text-base sm:text-lg max-w-xs"
                            >
                                <FaSignInAlt className="text-lg sm:text-xl" />
                                <span>Login</span>
                            </Link>
                            <Link
                                href={route('register')}
                                className="flex items-center border-white border-2 space-x-2 bg-black text-white hover:bg-white hover:text-black px-6 py-3 rounded-full transition duration-300 text-base sm:text-lg max-w-xs"
                            >
                                <FaUserPlus className="text-lg sm:text-xl" />
                                <span>Registrar</span>
                            </Link>
                        </div>
                    </div>
                </section>

                <Footer />

                <Feature1Modal isOpen={isFeature1ModalOpen} onClose={closeFeature1Modal} />
                <Feature2Modal isOpen={isFeature2ModalOpen} onClose={closeFeature2Modal} />
                <Feature3Modal isOpen={isFeature3ModalOpen} onClose={closeFeature3Modal} />
            </div>
        </>
    );
}
