import { useEffect, useState } from 'react';
import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import { FaGoogle, FaEye, FaEyeSlash, FaEnvelope, FaLock } from 'react-icons/fa';

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

    const submit = (e) => {
        e.preventDefault();
        post(route('login'));
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

            {status && <div className="mb-6 font-medium text-lg text-green-600 text-center">{status}</div>}

            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-700 to-blue-900">
                <div className="max-w-lg w-full bg-gray-100 p-8 rounded-lg shadow-xl">
                    <h2 className="text-6xl font-bold text-center text-blue-800 mb-10">Log in to Your Account</h2>

                    <form onSubmit={submit} className="space-y-6">
                        <div className="relative">
                            <InputLabel htmlFor="email" value="Email Address" className="text-xl" />
                            <div className="relative">
                                <FaEnvelope className={`absolute inset-y-0 left-0 flex items-center pl-3 mt-[18px] text-gray-400 text-3xl ${isTyping ? 'hidden' : ''}`} />
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
                                    className="w-full px-5 py-4 pl-10 text-xl text-gray-700 placeholder-gray-500 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                />
                            </div>
                            <InputError message={errors.email} className="text-lg" />
                        </div>

                        <div className="relative">
                            <InputLabel htmlFor="password" value="Password" className="text-xl" />
                            <div className="relative">
                                <FaLock className={`absolute inset-y-0 left-0 flex items-center pl-3 mt-4 text-gray-400 text-3xl ${isTyping ? 'hidden' : ''}`} />
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
                                    className="w-full px-5 py-4 pl-10 text-xl text-gray-700 placeholder-gray-500 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                />
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="absolute inset-y-0 right-0 flex items-center px-4 focus:outline-none"
                                >
                                    {showPassword ? (
                                        <FaEyeSlash className="text-gray-400 text-xl hover:text-gray-600" />
                                    ) : (
                                        <FaEye className="text-gray-400 text-xl hover:text-gray-600" />
                                    )}
                                </button>
                            </div>
                            <InputError message={errors.password} className="text-lg" />
                        </div>

                        <div className="flex items-center mb-6 ml-1">
                            <Checkbox
                                name="remember"
                                checked={data.remember}
                                onChange={(e) => setData('remember', e.target.checked)}
                                className="mr-4"
                            />
                            <span className="text-lg text-gray-700">Remember me</span>
                        </div>

                        <PrimaryButton
                            type="submit"
                            className="w-40 ml-[140px] bg-blue-800 hover:bg-blue-900 text-white py-4 rounded-full shadow-md text-lg flex items-center justify-center"
                            disabled={processing}
                            style={{ fontSize: '1.10rem' }} // Definir o tamanho do texto diretamente
                        >
                            {processing ? 'Logging in...' : 'Log in'}
                        </PrimaryButton>


                    </form>

                    <div className="ml-[109px] text-center mt-8">
                        <button
                            onClick={handleGoogleLogin}
                            disabled={processing}
                            className="flex items-center justify-center px-5 py-4 border border-gray-300 rounded-full bg-white text-lg text-blue-700 hover:text-white hover:bg-blue-800 shadow-md transition-all duration-200 ease-in-out"
                        >
                            <FaGoogle className="mr-3 text-xl transition-colors duration-200 ease-in-out hover:text-red-600" />
                            Log in with Google
                        </button>
                    </div>



                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="block text-center mt-6 text-lg text-blue-600 hover:underline hover:text-blue-900"
                        >
                            Forgot your password?
                        </Link>
                    )}


                    <div className="mt-8 text-lg text-center text-gray-600">
                        Don't have an account?{' '}
                        <Link href={route('register')} className="text-blue-600 hover:text-blue-900 hover:underline">
                            Sign up here.
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
