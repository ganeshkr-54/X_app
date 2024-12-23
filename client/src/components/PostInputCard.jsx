import API_INSTANCE from "../services/api.js";
import React, { useEffect, useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { ADD_POST_FOLLOWING_FEED } from '../redux/slices/feedSlice';


function PostInputCard() {
    const dispatch = useDispatch();
    const [postContent, setPostContent] = useState("");
    const [previewImage, setPreviewImage] = useState(null);
    const fileInputRef = useRef(null);

    async function createPost(event) {
        event.preventDefault(); // Prevent form from refreshing page

        try {
            const formData = new FormData();

            if (postContent.trim() === "") {
                alert("Post content cannot be empty");
                return;
            }
            // Add text content with key 'content'
            formData.append("content", postContent);

            // Check if a file is selected or not with key 'posts'
            if (fileInputRef.current?.files[0]) {
                formData.append("posts", fileInputRef.current.files[0]); // Append file to formData
            }

            let response = await API_INSTANCE.post("/post", formData);
            let newPost = response.data.data

            // Dispatch the new post to Redux state
            dispatch(ADD_POST_FOLLOWING_FEED(newPost))

            // Clear the form after submission
            setPostContent("");
            setPreviewImage(null);
            fileInputRef.current.value = "";

            alert('post added')
        } catch (error) {
            console.error("Error uploading post : ", error.message);
        }
    }

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setPreviewImage(URL.createObjectURL(file));
        } else {
            setPreviewImage(null);
        }
    };

    return (
        <div>
            <div className="post-input-card bg-white rounded-lg shadow-md px-4 py-3 flex flex-col gap-3">

                <h2 className="text-lg text-center font-bold">Create Post</h2>
                <form onSubmit={createPost} className="flex flex-col gap-3">
                    <textarea
                        value={postContent}
                        onChange={(e) => setPostContent(e.target.value)}
                        placeholder="Enter text content ..."
                        className="border p-2 rounded flex-1"
                    />
                    {previewImage && (
                        <div className="relative">
                            <img src={previewImage} alt="Preview" className="max-h-64 rounded" />
                            <button
                                type="button"
                                className="absolute top-2 right-2 bg-white rounded-full p-2 shadow"
                                onClick={() => setPreviewImage(null)}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    )}
                    <div className="flex items-center gap-2">
                        <label htmlFor="file-input" className="cursor-pointer">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </label>
                        <input
                            type="file"
                            id="file-input"
                            ref={fileInputRef}
                            accept="image/*,video/*"
                            className="hidden"
                            onChange={handleFileChange}
                        />
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded-full font-medium"
                            disabled={postContent.trim() === "" && !previewImage} // Disable button if both postContent and previewImage are empty
                        >
                            Post
                        </button>
                    </div>
                </form>
            </div>

        </div>
    );
}

export default PostInputCard;