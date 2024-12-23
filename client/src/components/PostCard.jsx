import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {
    Heart,
    Bookmark,
    MessageCircle
} from 'lucide-react';


import { TOGGLE_LIKE, TOGGLE_BOOKMARK, DELETE_POST } from '../redux/slices/feedSlice';
import API_INSTANCE from '../services/api';
import { formatDate } from '../utils/helpers';

function PostCard({ postDetails, isBookmarkPage = false , isProfilePage=false }) {
    console.log(postDetails)
    let postUser = useSelector((state) => state.auth.user.username)
    const dispatch = useDispatch();

    const [isLiked, setIsLiked] = useState(postDetails.isLiked);
    const [likesCount, setLikesCount] = useState(postDetails.likesCount);
    const [isBookmarked, setIsBookmarked] = useState(postDetails.isBookmarked);

    const handleLikeToggle = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        const id = postDetails.postId || postDetails._id;

        try {
            if (!id) {
                console.error("No post ID found:", postDetails);
                return;
            }

            await API_INSTANCE.post(`/like/${id}`);

            if (isBookmarkPage || isProfilePage ) {
                setIsLiked(!isLiked);
                setLikesCount(prevCount => isLiked ? prevCount - 1 : prevCount + 1);
                dispatch(TOGGLE_LIKE(id));
            } else {
                dispatch(TOGGLE_LIKE(id));
            }
        } catch (error) {
            console.error('Error toggling like:', error);
        }
    };

    const handleBookmarkToggle = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        const id = postDetails.postId || postDetails._id;

        try {
            if (!id) {
                console.error("No post ID found:", postDetails);
                return;
            }

            await API_INSTANCE.post(`/bookmark/${id}`);

            if (isBookmarkPage || isProfilePage) {
                setIsBookmarked(!isBookmarked);
                dispatch(TOGGLE_BOOKMARK(id));
            } else {
                dispatch(TOGGLE_BOOKMARK(id));
            }
        } catch (error) {
            console.error('Error toggling bookmark:', error);
            if (isBookmarkPage) {
                setIsBookmarked(isBookmarked);
            }
        }
    };

    async function deletePost(id) {
        try {
            await API_INSTANCE.delete(`/post/${id}`);
            dispatch(DELETE_POST(id));
            toast.success('Post deleted')
        } catch (error) {
            console.error("Error deleting comment:", error);
        }
    }

    return (
        <div className="px-4 py-3  rounded-lg mb-2">
            {/* User Profile Section */}
            <div className="flex space-x-3 relative">
                <div className="flex-shrink-0">
                    <img
                        src={postDetails.user.profileImg || '/default-avatar.png'}
                        alt="User"
                        className="w-7 h-7 md:w-10 md:h-10 object-cover rounded-full"
                    />
                </div>

                <div className="flex-1 min-w-0">
                    <Link to={`/${postDetails.user.username}`}>
                        <div className="flex items-center space-x-1">
                            <p className="text-[15px] font-bold text-gray-900 truncate">
                                {postDetails.user.name}
                            </p>
                            <span className="text-gray-500">·</span>
                            <p className="text-sm text-gray-500">
                                @{postDetails.user.username}
                            </p>
                        </div>
                    </Link>
                    <div className="absolute right-1 top-2">
                        {postDetails.user?.username === postUser &&
                            <button onClick={() => deletePost(postDetails._id)}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-3 md:6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                </svg>
                            </button>
                        }
                    </div>

                    <Link to={`/${postDetails?.user?.username}/post/${postDetails?.postId || postDetails?._id}`}>

                        {/* Post Content */}
                        <p className="text-[15px] text-gray-900 mt-1">
                            {postDetails?.content}
                        </p>

                        {/* Image */}
                        {postDetails.image && (
                            <div className="mt-3 rounded-xl overflow-hidden">
                                <img
                                    src={postDetails.image}
                                    alt="Post"
                                    className="w-full object-fit rounded-xl border border-gray-100"
                                />
                            </div>
                        )}

                        {/* Video */}
                        {postDetails?.video && (
                            <div className="mt-4 w-full">
                                <video
                                    src={postDetails?.video}
                                    className="w-full h-64 object-cover rounded-md mt-2"
                                    controls
                                >
                                    Video
                                </video>
                            </div>
                        )}
                    </Link>

                    {/* Actions Bar */}
                    <div className="flex items-center justify-between mt-3 px-1 w-full">
                        {/* Like Button */}
                        <button
                            onClick={handleLikeToggle}
                            className="group flex items-center space-x-2"
                        >
                            <Heart
                                className={`w-5 h-5 ${isBookmarkPage || isProfilePage
                                    ? isLiked
                                        ? "text-pink-500 fill-current"
                                        : "text-gray-500 group-hover:text-pink-500"
                                    : postDetails.isLiked
                                        ? "text-pink-500 fill-current"
                                        : "text-gray-500 group-hover:text-pink-500"
                                    }`}
                            />
                            <span className="text-sm text-gray-500 group-hover:text-pink-500">
                                {isBookmarkPage || isProfilePage ? likesCount : postDetails.likesCount}
                            </span>
                        </button>

                        {/* Comment Button */}
                        <button className="group flex items-center space-x-2">
                            <MessageCircle
                                className="w-5 h-5 text-gray-500 group-hover:text-blue-500"
                            />
                            <span className="text-sm text-gray-500 group-hover:text-blue-500">
                                {postDetails.commentCount}
                            </span>
                        </button>

                        {/* Bookmark Button */}
                        <button
                            onClick={handleBookmarkToggle}
                            className="group p-2 rounded-full hover:bg-blue-50"
                        >
                            <Bookmark
                                className={`w-5 h-5 ${(isBookmarkPage || isProfilePage)
                                    ? isBookmarked 
                                        ? "text-blue-500 fill-current"
                                        : "text-gray-500 group-hover:text-blue-500"
                                    : postDetails.isBookmarked
                                        ? "text-blue-500 fill-current"
                                        : "text-gray-500 group-hover:text-blue-500"
                                    }`}
                            />
                        </button>
                    </div>

                    {/* Created At */}
                    <div className="mt-2 text-sm text-gray-500">
                        <p>
                            {formatDate(postDetails.createdAt)} ago
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PostCard;