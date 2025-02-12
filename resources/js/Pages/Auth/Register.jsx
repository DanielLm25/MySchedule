import { useEffect, useState } from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import { FaUser, FaEnvelope, FaLock, FaUserFriends, FaHome } from 'react-icons/fa';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const [isNameTyping, setIsNameTyping] = useState(false);
    const [isEmailTyping, setIsEmailTyping] = useState(false);
    const [isPasswordTyping, setIsPasswordTyping] = useState(false);
    const [isPasswordConfirmTyping, setIsPasswordConfirmTyping] = useState(false);

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();

        post(route('register'));
    };

    return (
        <>
            <Head title="Register" />

            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-700 to-blue-900">
                <div className="absolute top-4 left-4">
                    <Link href="/" className="text-blue-200 hover:text-blue-900 focus:outline-none">
                        <FaHome className="text-5xl" /><svg
                            version="1.0"
                            xmlns="http://www.w3.org/2000/svg"
                            width="60"
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
                    </Link>
                </div>

                <div className="max-w-lg w-full bg-gray-100 p-8 rounded-lg shadow-xl">
                    <h2 className="text-6xl font-bold text-center text-blue-800 mb-10">Create Your Account</h2>

                    <form onSubmit={submit} className="space-y-6">
                        <div className="relative">
                            <FaUserFriends className={`absolute inset-y-0 left-0 flex items-center pl-3 mt-4 text-gray-400 text-3xl `} />

                            <TextInput
                                id="name"
                                name="name"
                                value={data.name}
                                placeholder="Name"
                                className="mt-1 block w-full px-5 py-4 text-xl text-gray-700 placeholder-gray-500 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 pl-10"
                                autoComplete="name"
                                onChange={(e) => {
                                    setData('name', e.target.value);
                                    setIsNameTyping(e.target.value !== '');
                                }}
                                required
                            />

                            <InputError message={errors.name} className="text-lg mt-2" />
                        </div>

                        <div className="relative">
                            <FaEnvelope className={`absolute inset-y-0 left-0 flex items-center pl-3 mt-4 text-gray-400 text-3xl`} />
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                placeholder="Email"
                                className="mt-4 block w-full px-5 py-4 text-xl text-gray-700 placeholder-gray-500 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 pl-10"
                                autoComplete="username"
                                onChange={(e) => {
                                    setData('email', e.target.value);
                                    setIsEmailTyping(e.target.value !== '');
                                }}
                                required
                            />

                            <InputError message={errors.email} className="text-lg mt-2" />
                        </div>

                        <div className="relative">
                            <FaLock className={`absolute inset-y-0 left-0 flex items-center pl-3 mt-4 text-gray-400 text-3xl `} />
                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                placeholder="Password"
                                className="mt-4 block w-full px-5 py-4 text-xl text-gray-700 placeholder-gray-500 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 pl-10"
                                autoComplete="new-password"
                                onChange={(e) => {
                                    setData('password', e.target.value);
                                    setIsPasswordTyping(e.target.value !== '');
                                }}
                                required
                            />

                            <InputError message={errors.password} className="text-lg mt-2" />
                        </div>

                        <div className="relative">
                            <FaLock className={`absolute inset-y-0 left-0 flex items-center pl-3 mt-4 text-gray-400 text-3xl`} />
                            <TextInput
                                id="password_confirmation"
                                type="password"
                                name="password_confirmation"
                                value={data.password_confirmation}
                                placeholder="Confirm Password"
                                className="mt-4 block w-full px-5 py-4 text-xl text-gray-700 placeholder-gray-500 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 pl-10"
                                autoComplete="new-password"
                                onChange={(e) => {
                                    setData('password_confirmation', e.target.value);
                                    setIsPasswordConfirmTyping(e.target.value !== '');
                                }}
                                required
                            />

                            <InputError message={errors.password_confirmation} className="text-lg mt-2" />
                        </div>

                        <div className="flex items-center justify-between mt-6 space-x-4">
                            <div className="flex-grow">
                                <Link
                                    href={route('login')}
                                    className="text-xl text-blue-500 hover:text-blue-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 hover:underline"
                                >
                                    Already registered?
                                </Link>
                            </div>

                            <PrimaryButton
                                className="bg-blue-600 hover:bg-gradient-to-r hover:from-blue-800 hover:to-blue-800 text-white py-4 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ease-in-out transform hover:scale-105"
                                disabled={processing}
                                style={{ fontSize: '1rem' }}
                            >
                                {processing ? 'Signing up...' : 'Sign Up'}
                            </PrimaryButton>
                        </div>

                    </form>
                </div>
            </div>
        </>
    );
}
