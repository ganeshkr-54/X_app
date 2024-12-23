import React, { useState } from 'react';
import API_INSTANCE from '../services/api.js';

function UpdateProfile() {
    const initialName = '';
    const initialBio = '';
    const [name, setName] = useState(initialName);
    const [bio, setBio] = useState(initialBio);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(null);
    const [success, setSuccess] = useState(null);

    // Check if any field has changed from initial values
    const hasUpdates = (name !== initialName || bio !== initialBio) && (name.trim() || bio.trim());

    async function handleSubmit(e) {
        e.preventDefault();
        setIsLoading(true);
        setIsError(null);
        setSuccess(null);

        // Check if at least one field is filled
        if (!name.trim() && !bio.trim()) {
            setIsError("Please enter either name or bio.");
            setIsLoading(false);
            return;
        }

        try {
            // Send name and bio to the backend only if they are non-empty
            const body = {
                name: name.trim() || undefined, // Only send if not empty
                bio: bio.trim() || undefined
            };

            const header = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            await API_INSTANCE.post('/user/updateprofile', body, header);

            setSuccess("Profile updated successfully");
        } catch (error) {
            setIsError(error.message || "An error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-center">Update Profile</h2>

            {isError && <p className="text-center mb-4 text-red-600">{isError}</p>}
            {success && <p className="text-center mb-4 text-green-600">{success}</p>}


            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Update your name"
                        className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label htmlFor="bio" className="block text-sm font-medium text-gray-700">Bio</label>
                    <textarea
                        id="bio"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Tell us about yourself"
                        rows="3"
                        className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    ></textarea>
                </div>

                <button
                    type="submit"
                    disabled={!hasUpdates || isLoading} // Disable if no updates or during loading
                    className={`w-full py-2 px-4 rounded-md text-white ${isLoading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                >
                    {isLoading ? 'Updating...' : 'Update Profile'}
                </button>
            </form>
        </div>
    );
};

export default UpdateProfile;
