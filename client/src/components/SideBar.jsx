import React, { useState} from 'react';
import { Link, useNavigate, NavLink } from 'react-router-dom';
import { House, Search, Bell, Settings, Bookmark, UserRound, LogOut, Plus, MoreVertical } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { LOGOUT } from '../redux/slices/authSlice';
import logo from '../assets/logo.jpeg'
import PostInputCardModal from './PostInputCardModal';
import { ADD_POST_FOLLOWING_FEED } from '../redux/slices/feedSlice';
import API_INSTANCE from "../services/api.js";


function SideBar() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { username, profileImg, name } = useSelector((state) => state.auth.user)
    const [showProfileModal, setShowProfileModal] = useState(false);
    const[showLogout,setShowLogout]=useState(false);

    const toggleModal = () => setIsModalOpen(!isModalOpen);

    const sideBarMenus = [
        {
            to: "/home",
            icon: House,
            name: "Home"
        },
        {
            to: "/notification",
            icon: Bell,
            name: "Notification"
        },
        {
            to: "/bookmarks",
            icon: Bookmark,
            name: "Bookmark"
        },
        {
            to: `/${username}`,
            icon: UserRound,
            name: "Profile"
        },
        {
            to: "/settings",
            icon: Settings,
            name: "Settings"
        },
    ]

    function LogoutUser() {
        dispatch(LOGOUT())
        navigate('/login')
    }

    async function createPost(textInput, fileInput) {
        const formData = new FormData();
        formData.append("content", textInput);
        
        if (fileInput) {
            formData.append("posts", fileInput);
        }

        try {
            const response = await API_INSTANCE.post("/post", formData);
            dispatch(ADD_POST_FOLLOWING_FEED(response.data.data));
            alert('Post added');
            toggleModal(); // Close modal after posting
        } catch (error) {
            console.error("Error uploading post:", error.message);
        }
    };

    return (
        <div className="fixed md:relative bottom-0 left-0 right-0 md:h-screen bg-white md:shadow-lg border-t md:border-r border-gray-200 md:p-4">
            <div className="hidden md:block mb-6">
                <Link to="/home">
                    <img src={logo} alt="Logo" className="w-14 h-12 mb-4" />
                </Link>
            </div>

            <div className="flex md:flex-col md:space-y-4 md:flex-grow">
                {/* Menu Items */}
                <ul className="flex flex-row md:flex-col justify-around w-full md:w-auto px-4 py-2 md:p-0">
                    {sideBarMenus.map((m) => (
                        <NavLink
                            to={m.to}
                            key={m.name}
                            className="text-lg font-medium text-gray-800"
                        >
                            {({ isActive }) => (
                                <li className={`flex items-center justify-center md:justify-start gap-3 p-3 rounded-full hover:bg-gray-100 transition ease-in-out duration-200 ${isActive ? 'font-bold text-blue-500' : ''}`}>
                                    <m.icon className="w-6 h-6" />
                                    <span className="hidden md:block">{m.name}</span>
                                </li>
                            )}
                        </NavLink>))}
                </ul>

                <button 
                    className="hidden md:block bg-blue-500 text-white font-bold py-2 px-6 rounded-full hover:bg-blue-600 transition ease-in-out duration-200 mt-4 w-full"
                    onClick={toggleModal}
                >
                    Post
                </button>
                <PostInputCardModal 
                    isModalOpen={isModalOpen}
                    toggleModal={toggleModal}
                    createPost={createPost}
                />
            </div>

            <div className="hidden absolute bottom-1 md:flex items-center justify-between p-2 space-x-2">
                <div className=" w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                    <img
                        src={profileImg || '/default-avatar.png'}
                        alt="User"
                        className="w-10 h-10 rounded-full object-cover"
                    />
                </div>
                <span>
                    <h1 className="text-sm font-semibold text-gray-700">{name}</h1>
                    <h1 className="text-sm font-semibold text-gray-700">@{username}</h1>
                </span>

                <button onClick={()=>setShowLogout(!showLogout)}
                className="p-2 hover:bg-gray-100 rounded-full">
                            <MoreVertical className="w-5 h-5" /></button>
                {showLogout && (
                    <div className="absolute bottom-full right-0 mb-2 bg-white rounded-lg shadow-lg border border-gray-200 py-2 w-48">
                    <button 
                        onClick={LogoutUser}
                        className="flex items-center gap-2 px-4 py-2 text-red-500 w-full hover:bg-gray-50"
                    >
                        <LogOut className="w-5 h-5" />
                        <span>Logout</span>
                    </button>
                </div>
                )}
                
            </div>



            {/*Mobile view*/}

            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
                <div className="flex items-center justify-around px-4 py-2 relative">
                    {sideBarMenus
                        .filter(m => m.name.toLowerCase() !== 'settings' && m.name.toLowerCase() !== 'profile')
                        .map((m) => (
                            <NavLink
                                to={m.to}
                                key={m.name}
                                className={({ isActive }) =>
                                    `p-2 ${isActive ? 'text-blue-500' : 'text-gray-700'}`
                                }
                            >
                                <m.icon className="w-6 h-6" />
                            </NavLink>
                        ))
                    }

                    <button onClick={toggleModal} className="bg-blue-500 text-white p-3 rounded-full md:hidden absolute -top-6 left-1/2 transform -translate-x-1/2">
                        <Plus />
                    </button>
                    <PostInputCardModal 
                    isModalOpen={isModalOpen}
                    toggleModal={toggleModal}
                    createPost={createPost}
                    />

                    <button onClick={() => setShowProfileModal(!showProfileModal)}>
                        <img src={profileImg} className='w-6 h-6 rounded-full object-cover' />

                    </button>

                </div>
                <div className='md:hidden'>
                    {showProfileModal && (
                        <div className="absolute bottom-16 right-8 bg-white p-2 px-4 rounded-sm">
                            <div className="flex flex-col justify-start space-y-4">
                                <NavLink to={`/${username}`} className="flex items-center gap-2 text-gray-700"> 
                                    <UserRound />
                                    <span>Profile</span>
                                </NavLink>

                                <NavLink to="/settings"className="flex items-center gap-2 text-gray-700" >
                                    <Settings />
                                    <span>Settings</span>
                                </NavLink>

                                <button onClick={LogoutUser} className="flex items-center gap-2 text-gray-700">
                                    <LogOut />
                                    <span>Logout</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
}

export default SideBar;
