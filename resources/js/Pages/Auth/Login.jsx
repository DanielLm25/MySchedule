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
                        <FaHome className="text-4xl sm:text-5xl" />
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
