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
                                <FaUserCircle className="text-3xl text-white" />
                                <h1 className="text-2xl font-bold text-white">Welcome</h1>
                            </div>
                            <nav className="flex space-x-4">
                                {auth.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="flex items-center space-x-1 text-white text-base sm:text-xl px-3 py-2 rounded-md transition duration-300 hover:text-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
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
                        <div className="max-w-2xl lg:max-w-7xl">
                            <header className="py-10">
                                <h1 className="text-4xl md:text-6xl lg:text-8xl font-poppins font-bold text-white mb-4">Welcome to Our Application</h1>
                                <p className="text-base md:text-lg lg:text-xl text-gray-200">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla accumsan, metus ultrices eleifend gravida.
                                </p>
                            </header>
                        </div>
                    </div>
                </section>

                <section className="py-12 bg-gradient-to-r from-[#000000] to-[#000042] flex items-center justify-center h-screen">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold font-poppins mb-4 text-white">Super Features for You!</h1>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                            {/* Card 1 - Dark Blue */}
                            <FeatureCard
                                icon={<FaLightbulb className="text-5xl md:text-6xl lg:text-8xl text-blue-300" />}
                                title="Feature 1"
                                description="Description of feature 1. Lorem ipsum dolor sit amet, consectetur adipiscing elit."
                                onLearnMore={openFeature1Modal}
                            />

                            {/* Card 2 - Dark Blue */}
                            <FeatureCard
                                icon={<FaLock className="text-5xl md:text-6xl lg:text-8xl text-blue-300" />}
                                title="Feature 2"
                                description="Description of feature 2. Nulla accumsan, metus ultrices eleifend gravida."
                                onLearnMore={openFeature2Modal}
                            />

                            {/* Card 3 - Dark Blue */}
                            <FeatureCard
                                icon={<FaUserFriends className="text-5xl md:text-6xl lg:text-8xl text-blue-300" />}
                                title="Feature 3"
                                description="Description of feature 3. Phasellus vestibulum nisi vitae nunc convallis venenatis."
                                onLearnMore={openFeature3Modal}
                            />
                        </div>
                    </div>
                </section>

                <section className="py-12 bg-black text-white flex items-center justify-center h-screen">
                    <div className="max-w-2xl mx-auto text-center">
                        <h2 className="text-4xl md:text-5xl lg:text-8xl font-bold font-poppins mb-6">Join Us Today</h2>
                        <p className="text-base md:text-lg lg:text-2xl text-gray-300 mb-8">Experience all the benefits by logging in or registering now.</p>
                        <div className="flex flex-col md:flex-row md:space-x-4 justify-center space-y-4 md:space-y-0">
                            <Link
                                href={route('login')}
                                className="flex items-center space-x-2 bg-white text-black hover:bg-gray-200 px-6 py-3 rounded-full transition duration-300 text-base md:text-lg max-w-[250px] max ml-[80px]"
                            >
                                <FaSignInAlt />
                                <span>Log In</span>
                            </Link>
                            <Link
                                href={route('register')}
                                className="flex items-center space-x-2 bg-blue-500 text-white hover:bg-blue-600 px-6 py-3 rounded-full transition duration-300 text-base md:text-lg max-w-[250px] max ml-[80px]"
                            >
                                <FaUserPlus />
                                <span>Register</span>
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
