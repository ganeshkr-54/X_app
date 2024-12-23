// pages/SettingsPage.jsx
import React from 'react';
import ChangePasswordForm from '../components/ChangePasswordForm';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

function SettingsPage() {
    const navigate =useNavigate()
    return (
        <div className="min-h-screen bg-gray-50 py-8">

            <div className="flex items-center mt-1.5  mb-6">
                <button
                    className="back-button flex items-center text-lg font-medium text-gray-600 mx-3"
                    onClick={() => navigate(`/home`)}
                >
                    <ArrowLeft className="mr-2 w-6 h-6" style={{ color: '#1DA1F2' }} />
                </button>
                <h1 className="text-2xl font-bold text-gray-900 ">Settings</h1>
            </div>

            <div className="max-w-2xl mx-auto px-4">

                {/* Change Password Section */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Change Password</h2>
                    <ChangePasswordForm />
                </div>

                {/* You can add more settings sections here later */}
            </div>
        </div>
    );
}

export default SettingsPage;