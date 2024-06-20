import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import DeleteUserForm from './Partials/DeleteUserForm';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import axios from 'axios';

export default function Edit({ auth, mustVerifyEmail, status }) {
    const [permissionType, setPermissionType] = useState(auth.user.permission_type);
    const [accessCode, setAccessCode] = useState('');

    const handlePermissionTypeChange = (e) => {
        setPermissionType(e.target.value);
    };

    const handleSavePermissionType = async () => {
        try {
            const response = await axios.post('/profile/update-permission-type', {
                permission_type: permissionType
            });

            setAccessCode(response.data.access_code);
            console.log('Permission type updated successfully:', response.data);
        } catch (error) {
            console.error('Failed to update permission type:', error);
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Profile</h2>}
        >
            <Head title="Profile" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="max-w-xl"
                        />
                    </div>

                    <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                        <UpdatePasswordForm className="max-w-xl" />
                    </div>

                    <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                        <DeleteUserForm className="max-w-xl" />
                    </div>

                    <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                        <label className="block font-medium text-gray-700">Agenda Protection Type</label>
                        <select
                            value={permissionType}
                            onChange={handlePermissionTypeChange}
                            className="mt-1 block w-full p-2 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                            <option value="private">Private</option>
                            <option value="public">Public</option>
                            <option value="protected">Protected</option>
                        </select>
                        {accessCode && (
                            <p className="mt-4 text-gray-700">
                                Access Code: {accessCode}
                            </p>
                        )}
                        <button
                            onClick={handleSavePermissionType}
                            className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Save Permission Type
                        </button>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
