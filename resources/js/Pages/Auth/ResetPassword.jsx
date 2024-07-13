import { useEffect } from 'react';
import { Head, useForm, Link } from '@inertiajs/react'; // Importando Link do Inertia.js
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEnvelope, FaLock } from 'react-icons/fa'; // Importando ícones

import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';

export default function ResetPassword({ token, email }) {
    const { data, setData, post, processing, reset, errors } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        if (!data.password || !data.password_confirmation) {
            toast.error('Password and Confirm Password are required');
            return;
        }

        if (data.password !== data.password_confirmation) {
            toast.error('Password and Confirm Password must match');
            return;
        }

        post(route('password.store'))
            .then((response) => {
                toast.success(response.message); // Exibe mensagem de sucesso em toast
                // Redireciona para a página de login após sucesso
                return route('login').url(); // Obtém a URL da rota de login
            })
            .then((url) => {
                // Utiliza o componente Link do Inertia.js para redirecionar
                return <Link href={url}>Login</Link>;
            })
            .catch((error) => {
                if (error.response.data.errors) {
                    Object.values(error.response.data.errors).forEach((error) => {
                        toast.error(error); // Exibe mensagens de erro em toast
                    });
                } else {
                    toast.error(error.response.data.message); // Exibe mensagem de erro em toast
                }
            });
    };

    useEffect(() => {
        // Limpa os campos de senha ao desmontar o componente
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    // Exibe toast de erro quando errors.email é atualizado
    useEffect(() => {
        if (errors.email) {
            toast.error(errors.email);
        }
    }, [errors.email]);

    return (
        <>
            <Head title="Reset Password" />

            <div className="relative min-h-screen bg-gradient-to-br from-blue-700 to-blue-900">
                <div className="flex items-center justify-center min-h-screen">
                    <div className="max-w-2xl w-full bg-gray-100 p-8 rounded-lg shadow-xl">
                        <h2 className="text-6xl font-bold text-center text-blue-800 mb-10">Reset Password</h2>

                        <form onSubmit={submit} className="space-y-6">
                            <div className="relative">
                                <FaEnvelope className="mt-3 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
                                <InputLabel htmlFor="email" value="Email" />
                                <TextInput
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="pl-10 py-2 block w-full text-xl rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    autoComplete="username"
                                    onChange={(e) => setData('email', e.target.value)}
                                />
                            </div>

                            <div className="relative">
                                <FaLock className="mt-2 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
                                <InputLabel htmlFor="password" value="Password" />
                                <TextInput
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    className="pl-10 py-2 block w-full text-xl rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    autoComplete="new-password"
                                    onChange={(e) => setData('password', e.target.value)}
                                />
                            </div>

                            <div className="relative">
                                <FaLock className="mt-2 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
                                <InputLabel htmlFor="password_confirmation" value="Confirm Password" />
                                <TextInput
                                    type="password"
                                    id="password_confirmation"
                                    name="password_confirmation"
                                    value={data.password_confirmation}
                                    className="pl-10 py-2 block w-full text-xl rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    autoComplete="new-password"
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                />
                            </div>

                            <div className="flex items-center justify-end">
                                <PrimaryButton className="ml-[125px] bg-blue-600 hover:bg-gradient-to-r hover:from-blue-800 hover:to-blue-800 text-white text-2xl py-4 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ease-in-out transform hover:scale-105" disabled={processing}
                                    style={{ fontSize: '1rem', fontWeight: 'bold' }}
                                >
                                    Reset Password
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
                newestOnTop={true} // Exibir novos toasts no topo
                closeOnClick // Fechar ao clicar
                rtl={false} // Direção de texto para idiomas da direita para a esquerda
                pauseOnFocusLoss // Pausar ao perder foco
                draggable // Arrastável
                pauseOnHover // Pausar ao passar o mouse
                toastOptions={{
                    className: 'text-lg font-bold', // Estilo do texto do toast
                }}
            />
        </>
    );
}
