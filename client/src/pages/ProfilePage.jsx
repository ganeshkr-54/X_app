import React from 'react'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import API_INSTANCE from '../services/api.js';
import PostCard from '../components/PostCard';
import InfiniteScroll from 'react-infinite-scroll-component';
import ProfileCard from '../components/ProfileCard';
import UpdateProfile from '../components/UpdateProfile.jsx';
import Modal from '../components/Modal.jsx';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

/*
fetch the profile data from the params(username) along with his posts(infinite scroll)
*/
function ProfilePage() {
    let user = useSelector((state) => state.auth.user.username)
    const { username } = useParams();
    const [profileData, setProfileData] = useState(null);
    const [postData, setPostData] = useState([]);
    const [isProfileLoading, setIsProfileLoading] = useState(false);
    const [isPostLoading, setIsPostLoading] = useState(false);
    const [profileError, setProfileError] = useState(null);
    const [postError, setPostError] = useState(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    // Need to fetch all Profile Data
    async function fetchProfileData() {
        try {
            setIsProfileLoading(true);
            const pd_response = await API_INSTANCE.get(`/user/details/${username}`);
            setProfileData(pd_response.data.data);
        } catch (error) {
            console.log("error in fetchProfileData api : ", error);
            setProfileData(null);
            setProfileError(error.message);
        } finally {
            setIsProfileLoading(false);
        }
    }

    async function fetchPostData() {
        try {
            setIsPostLoading(true);
            const post_response = await API_INSTANCE.get(`/post/user/${username}?page=${page}&limit=10`);
            const newPosts = post_response.data.data.docs;
            setPostData((prevPosts) => [...prevPosts, ...newPosts]);
            // Check if there are more posts to load
            if (newPosts.length === 0) {
                setHasMore(false); // No more posts available
            } else {
                setHasMore(true); // More posts are available
            }
        } catch (error) {
            console.log("error in fetchPostData api : ", error);
            setPostData(null);
            setPostError(error.message);
        } finally {
            setIsPostLoading(false);
        }
    }



    async function handleFollow() {
        try {
            const response = await API_INSTANCE.post(`/follow/${profileData._id}`);

            const message = response.data.message;

            // //updating the following state
            setProfileData((prevState) => (
                {
                    ...prevState,
                    isFollowing: message == 'User Unfollowed' ? false : true
                }
            ))
            toast(` ${response.data.message == 'User Unfollowed' ? 'User Unfollowed' : 'User followed'} `)

        }

        catch (error) {
            console.log("error in fetchBookmarks api : ", error);
        }
    }

    useEffect(() => {
        fetchProfileData();
    }, [username]);

    useEffect(() => {
        fetchPostData();
    }, [username, page]);

    const fetchMoreData = () => {
        if (hasMore) { // Only fetch more if hasMore is true
            setPage((prevPage) => prevPage + 1); // Load the next page
        }
    };


    if (isProfileLoading) {
        return <div className="p-4 absolute top-5 left-1/2 transform -translate-x-1/2">
            <button disabled type="button" className="py-2.5 px-5 me-2 text-lg font-medium text-gray-900 bg-white rounded-lg  hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:outline-none focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 inline-flex items-center">
                <svg aria-hidden="true" role="status" className="inline w-6 h-6 me-3 text-gray-200 animate-spin dark:text-gray-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="#1C64F2" />
                </svg>
                Loading...
            </button>
        </div>
    }

    if (profileError) {
        return <div className="p-4 text-red-500">Error loading profile: {profileError}</div>;
    }

    // Adjust the logic to handle null or empty object
    if (profileData === null) {
        return <div className="p-4">No profile data found</div>; // Handling null specifically
    }

    // Add an additional check for empty profileData object
    if (profileData.length === 0) {
        return <div className="p-4">Profile data is empty</div>; // Handle case when profileData is an empty object
    }

    // Continue with post loading checks
    if (isPostLoading && !postData.length) {
        return <div className="p-4 absolute top-5 left-1/2 transform -translate-x-1/2">
            <button disabled type="button" className="py-2.5 px-5 me-2 text-lg font-medium text-gray-900 bg-white rounded-lg  hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:outline-none focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 inline-flex items-center">
                <svg aria-hidden="true" role="status" className="inline w-6 h-6 me-3 text-gray-200 animate-spin dark:text-gray-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="#1C64F2" />
                </svg>
                Loading...
            </button>
        </div>
    }

    if (postError) {
        return <div className="p-4 text-red-500">Error loading posts: {postError}</div>;
    }

    // Handling case when there are no posts but valid profile data
    // if (profileData && !postData.length && !isPostLoading) {
    //     return <div className="p-4">No posts found for this profile</div>;
    // }


    return (
        <div className='md:mx-2 md:px-2 w-full'>
            <div className='bg-white'>
                <div className=' relative '>
                    {profileData ? (
                        <div> <ProfileCard profileData={profileData} /> </div>
                    ) : (
                        <div className="p-4">Loading profile...</div>
                    )}

                    {/* for updating the profile name & bio */}
                    {user === username ?
                        (
                            <div className="profile-page p-4  absolute right-1 bottom-20">
                                <button
                                    onClick={handleOpenModal}
                                    className=" border border-gray-500 bg-black text-white text-sm px-2 py-1 rounded-3xl"
                                >
                                    Edit Profile
                                </button>

                                {/* Modal for UpdateProfile */}
                                <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                                    <UpdateProfile />
                                </Modal>
                            </div>) :

                        <div className="profile-page p-4  absolute right-1 bottom-20">

                            <button
                                onClick={handleFollow}
                                className=" border border-gray-500 bg-black text-white text-sm px-2 py-1 rounded-3xl"
                            >
                                {profileData.isFollowing ? "Following" : "Follow"}
                            </button>
                        </div>
                    }
                </div>
            </div>

            <div className="border-b border-gray-200">
                <button 
                    className="px-8 py-4 text-black font-medium border-b-4 border-blue-500"
                    onClick={() => fetchPostData()} // Optional: refetch posts
                >
                    Posts
                </button>
            </div>

            <InfiniteScroll
                dataLength={postData.length} // Length of currently displayed items
                next={fetchMoreData} // Function to load more data
                hasMore={hasMore} // Keep loading until there's no more data
                loader={<h4>Loading more posts...</h4>}
                endMessage={
                    <p style={{ textAlign: 'center' }}>
                        <b>Yay! You have seen it all</b>
                    </p>
                }
                pullDownToRefresh
                pullDownToRefreshThreshold={50}
                pullDownToRefreshContent={
                    <h3 style={{ textAlign: 'center' }}>&#8595; Pull down to refresh</h3>
                }
                releaseToRefreshContent={
                    <h3 style={{ textAlign: 'center' }}>&#8593; Release to refresh</h3>
                }
                refreshFunction={() => window.location.reload()}
            >
                {
                    postData.map((post, idx) => (
                        <PostCard key={idx} postDetails={post} isProfilePage={true} />
                    ))
                }
            </InfiniteScroll>
        </div>
    )
}

export default ProfilePage