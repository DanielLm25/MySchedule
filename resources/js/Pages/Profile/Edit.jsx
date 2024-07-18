import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import DeleteUserForm from './Partials/DeleteUserForm';
import { useState } from 'react';
import axios from 'axios';

export default function Edit({ auth, mustVerifyEmail, status }) {
    const [permissionType, setPermissionType] = useState(auth.user.permission_type);
    const [accessCode, setAccessCode] = useState(auth.user.access_code || '');

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
        <AuthenticatedLayout user={auth.user}>
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

                        {permissionType === 'protected' && (
                            <div className="mt-4">
                                <label className="block font-medium text-gray-700">Access Code</label>
                                <input
                                    type="text"
                                    value={accessCode}
                                    readOnly
                                    className="mt-1 block w-full p-2 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            </div>
                        )}

                        <button
                            onClick={handleSavePermissionType}
                            className="mt-4 inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:ring focus:ring-indigo-200 active:bg-indigo-600 disabled:opacity-25 transition"
                        >
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
