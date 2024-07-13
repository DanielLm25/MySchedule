import { useEffect, useState } from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import { FaUser, FaEnvelope, FaLock, FaUserFriends } from 'react-icons/fa';

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

                        <div className="flex items-center justify-between mt-6">
                            <div>
                                <Link
                                    href={route('login')}
                                    className="ml-1 text-xl text-blue-500 hover:text-blue-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 hover:underline"
                                >
                                    Already registered?
                                </Link>
                            </div>

                            <PrimaryButton className="bg-blue-800 hover:bg-blue-900 text-white rounded-full shadow-md text-lg flex items-center justify-center w-full max-w-[180px] py-4 text-xl" disabled={processing} style={{ fontSize: '1rem' }}>
                                {processing ? 'Signing up...' : 'Sign Up'}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
