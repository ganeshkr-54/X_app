import React from 'react';
import { useSelector } from 'react-redux';
import { useRef, useState } from 'react';
import API_INSTANCE from '../services/api.js';
import { CalendarDays, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom';

function ProfileCard({ profileData }) {
    const user = useSelector((state) => state.auth.user.username);
    const profileInputRef = useRef(null);
    const coverInputRef = useRef(null);
    const [profileImg, setProfileImg] = useState(profileData?.profileImg || '/default-avatar.png');
    const [coverImg, setCoverImg] = useState(profileData?.coverImg || '/default-avatar.png');


    async function handleFileUpload(file, type) {
        const formData = new FormData();
        formData.append(type, file);

        try {
            let endpoint = type === 'profile' ? "/user/uploadProfilePic" : "/user/uploadCoverPic";
            const response = await API_INSTANCE.post(endpoint, formData);


            if (type === 'profile') {
                setProfileImg(response.data.data);
                alert('Profile uploaded successfully');
            } else {
                setCoverImg(response.data.data);
                alert('Cover picture uploaded successfully');
            }

        } catch (error) {
            console.error("Image upload error:", error);
        }
    };

    const handleFileChange = (event, type) => {
        const file = event.target.files[0];
        if (file) {
            handleFileUpload(file, type);
        }
    };

    return (
        <>
            <div className='flex flex-col md:px-1 relative'>

                <div className='w-full relative'>

                    {/* Cover Image */}
                    <label htmlFor="coverImgInput">
                        <img
                            src={coverImg}
                            alt="Cover"
                            className="w-full h-32 object-cover cursor-pointer"
                        />
                    </label>
                    {user === profileData.username && (
                        <input
                            id="coverImgInput"
                            type="file"
                            style={{ display: 'none' }}
                            ref={coverInputRef}
                            onChange={(e) => handleFileChange(e, 'cover')}
                        />
                    )}

                    {/* Profile Pic */}
                    <div className='absolute bottom-0 left-2 translate-y-1/2'>
                        <label htmlFor="profileImgInput">
                            <img
                                src={profileImg}
                                alt="Profile"
                                className="w-24 h-24 rounded-full object-cover border-4 border-white cursor-pointer"
                            />
                        </label>
                        {user === profileData.username && (
                            <input
                                id="profileImgInput"
                                type="file"
                                style={{ display: 'none' }}
                                ref={profileInputRef}
                                onChange={(e) => handleFileChange(e, 'profile')}
                            />
                        )}
                    </div>
                </div>

                {/* Profile Details */}
                <div className="mt-12 m-4 ">
                    <p className="text-lg font-semibold text-gray-700">
                        {profileData?.name}
                    </p>
                    <p className="text-sm font-semibold text-gray-500">
                        @{profileData?.username}
                    </p>
                    <p className="text-sm text-gray-500">
                        {profileData?.bio}
                    </p>
                    <p className="text-sm text-gray-500">
                        {profileData?.email}
                    </p>
                    <p className='flex items-baseline space-x-1'><MapPin className='h-4 w-4' /> <span>Hyderabad</span></p>
                    <p className="text-sm text-gray-500 flex items-baseline space-x-1">Joined 
                        <CalendarDays className='h-4 w-4' />{new Date(profileData?.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        })}
                    </p>
                </div>
                <div className='flex space-x-6 text-lg font-semibold'>
                    <Link to={`/${profileData?.username}/followers`}>
                        <p>{profileData.followersCount || 0} <span className='text-gray-600 text-base'>Followers</span></p>
                    </Link>
                    <Link to={`/${profileData?.username}/following`}>
                        <p>{profileData.followingCount || 0} <span className='text-gray-600 text-base'>Following</span></p>
                    </Link>
                </div>
            </div>
            <hr />

        </>
    );
}

export default ProfileCard;