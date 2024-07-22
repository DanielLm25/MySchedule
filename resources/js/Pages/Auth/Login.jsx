import { useEffect, useState } from 'react';
import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import { FaGoogle, FaEye, FaEyeSlash, FaEnvelope, FaLock, FaHome } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);
    const [isTyping, setIsTyping] = useState(false);

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = async (e) => {
        e.preventDefault();

        if (!data.email || !data.password) {
            toast.error('Please fill in all fields.');
            return;
        }

        const response = await post('/login');

        if (response.ok) {
            toast.success('Logged in successfully!');
        } else {
            toast.error('Invalid email or password.');
        }
    };

    const handleGoogleLogin = () => {
        window.location = '/auth/google';
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleInputChange = () => {
        setIsTyping(true);
    };

    const handleInputBlur = () => {
        setIsTyping(false);
    };

    return (
        <>
            <Head title="Log in" />
            <ToastContainer position="top-center" />

            {status && <div className="mb-6 font-medium text-lg text-green-600 text-center">{status}</div>}

            <div className="relative min-h-screen bg-gradient-to-br from-blue-700 to-blue-900 flex flex-col justify-center">
                <div className="absolute top-4 left-4">
                    <Link href="/" className="text-blue-200 hover:text-blue-900 focus:outline-none">
                        <svg
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

                <div className="flex items-center justify-center flex-grow p-4">
                    <div className="w-full max-w-md bg-gray-100 p-6 sm:p-8 rounded-lg shadow-xl">
                        <h2 className="text-3xl sm:text-4xl font-bold text-center text-blue-800 mb-6 sm:mb-8">Log in to Your Account</h2>

                        <form onSubmit={submit} className="space-y-6">
                            <div className="relative">
                                <InputLabel htmlFor="email" value="Email Address" className="text-lg sm:text-xl" />
                                <div className="relative">
                                    <FaEnvelope className={`absolute inset-y-0 left-0 flex items-center pl-3 mt-3 text-gray-400 text-xl sm:text-2xl ${isTyping ? 'hidden' : ''}`} />
                                    <TextInput
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        autoComplete="username"
                                        onChange={(e) => {
                                            setData('email', e.target.value);
                                            handleInputChange();
                                        }}
                                        onBlur={handleInputBlur}
                                        required
                                        placeholder="Email"
                                        className="w-full px-4 py-3 pl-10 text-lg sm:text-xl text-gray-700 placeholder-gray-500 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                    />
                                </div>
                                <InputError message={errors.email} className="text-sm sm:text-lg" />
                            </div>

                            <div className="relative">
                                <InputLabel htmlFor="password" value="Password" className="text-lg sm:text-xl" />
                                <div className="relative">
                                    <FaLock className={`absolute inset-y-0 left-0 flex items-center pl-3 mt-3 text-gray-400 text-xl sm:text-2xl ${isTyping ? 'hidden' : ''}`} />
                                    <TextInput
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={data.password}
                                        autoComplete="current-password"
                                        onChange={(e) => {
                                            setData('password', e.target.value);
                                            handleInputChange();
                                        }}
                                        onBlur={handleInputBlur}
                                        required
                                        placeholder="Password"
                                        className="w-full px-4 py-3 pl-10 text-lg sm:text-xl text-gray-700 placeholder-gray-500 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                    />
                                    <button
                                        type="button"
                                        onClick={togglePasswordVisibility}
                                        className="absolute inset-y-0 right-0 flex items-center px-4 focus:outline-none"
                                    >
                                        {showPassword ? (
                                            <FaEyeSlash className="text-gray-400 text-xl sm:text-2xl hover:text-gray-600" />
                                        ) : (
                                            <FaEye className="text-gray-400 text-xl sm:text-2xl hover:text-gray-600" />
                                        )}
                                    </button>
                                </div>
                                <InputError message={errors.password} className="text-sm sm:text-lg" />
                            </div>

                            <div className="flex items-center mb-6">
                                <Checkbox
                                    name="remember"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="mr-4"
                                />
                                <span className="text-lg sm:text-xl text-gray-700">Remember me</span>
                            </div>

                            <PrimaryButton
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 sm:py-4 rounded-full shadow-lg text-lg sm:text-xl flex items-center justify-center transition-all duration-300 ease-in-out"
                                disabled={processing}
                            >
                                {processing ? 'Logging in...' : 'Log in'}
                            </PrimaryButton>
                        </form>

                        <div className="text-center mt-6">
                            <button
                                onClick={handleGoogleLogin}
                                disabled={processing}
                                className="w-full bg-white border border-gray-300 text-blue-700 hover:bg-blue-800 hover:text-white py-3 sm:py-4 rounded-full shadow-lg text-lg sm:text-xl flex items-center justify-center transition-all duration-300 ease-in-out"
                            >
                                <FaGoogle className="mr-3 text-xl sm:text-2xl" />
                                Log in with Google
                            </button>
                        </div>

                        {canResetPassword && (
                            <Link
                                href="/forgot-password"
                                className="block text-center mt-6 text-lg sm:text-xl text-blue-600 hover:underline hover:text-blue-900"
                            >
                                Forgot your password?
                            </Link>
                        )}

                        <div className="mt-6 sm:mt-8 text-lg sm:text-xl text-center text-gray-600">
                            Don't have an account?{' '}
                            <Link href="/register" className="text-blue-600 hover:text-blue-900 hover:underline">
                                Sign up here.
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
