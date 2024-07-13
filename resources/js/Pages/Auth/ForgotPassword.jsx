import { useEffect } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import { FaHome, FaEnvelope } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    // Exibe toast de sucesso quando status é atualizado
    useEffect(() => {
        if (status) {
            toast.success(status);
        }
    }, [status]);

    // Exibe toast de erro quando errors.email é atualizado
    useEffect(() => {
        if (errors.email) {
            toast.error(errors.email);
        }
    }, [errors.email]);

    return (
        <>
            <Head>
                <title>Forgot Password</title>
            </Head>
            <div className="relative min-h-screen bg-gradient-to-br from-blue-700 to-blue-900">
                <div className="absolute top-4 left-4">
                    <Link href="/" className="text-blue-200 hover:text-blue-900 focus:outline-none">
                        <FaHome className="text-5xl" />
                    </Link>
                </div>

                <div className="flex items-center justify-center min-h-screen">
                    <div className="max-w-xl w-full bg-gray-100 p-8 rounded-lg shadow-xl">
                        <h2 className="text-6xl font-bold text-center text-blue-800 mb-10">Forgot Password</h2>

                        <div className="mb-4 text-xl text-gray-600">
                            Forgot your password? No problem. Just let us know your email address and we will email you a password reset link that will allow you to choose a new one.
                        </div>

                        <form onSubmit={submit} className="space-y-6">
                            <div className="relative">
                                <label htmlFor="email" className="text-xl">
                                    Email Address
                                </label>
                                <div className="relative mt-4">
                                    <FaEnvelope className="absolute left-3 top-5 text-gray-400 text-2xl" />
                                    <TextInput
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className="w-full px-10 py-4 pl-12 text-lg text-gray-700 placeholder-gray-500 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                        autoComplete="username"
                                        placeholder="Email Address"
                                    />
                                </div>

                            </div>

                            <div className="flex items-center justify-end mt-4">
                                <PrimaryButton
                                    className="w-full ml-[125px] bg-blue-600 hover:bg-gradient-to-r hover:from-blue-800 hover:to-blue-800 text-white py-4 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ease-in-out transform hover:scale-105"
                                    type="submit"
                                    disabled={processing}
                                    style={{ fontSize: '1rem', fontWeight: 'bold' }}
                                >
                                    Email Password Reset Link
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            {/* ToastContainer com opções personalizadas */}
            <ToastContainer
                position="top-center" // Posição dos toasts
                autoClose={5000} // Tempo para fechar automaticamente
                hideProgressBar={false} // Ocultar barra de progresso
                newestOnTop={false} // Exibir novos toasts no topo
                closeOnClick // Fechar ao clicar
                rtl={false} // Direção de texto para idiomas da direita para a esquerda
                pauseOnFocusLoss // Pausar ao perder foco
                draggable // Arrastável
                pauseOnHover // Pausar ao passar o mouse
                toastOptions={{
                    // Opções individuais para cada tipo de toast (success, error, etc.)
                    success: {
                        className: 'bg-green-500',
                        progressClassName: 'bg-green-200',
                    },
                    error: {
                        className: 'bg-red-500',
                        progressClassName: 'bg-red-200',
                    },
                }}
            />
        </>
    );
}
