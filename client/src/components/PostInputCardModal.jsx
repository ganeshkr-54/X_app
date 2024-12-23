import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

function PostInputCardModal({ isModalOpen, toggleModal, createPost }) {
    const [textInput, setTextInput] = useState('');
    const [fileInput, setFileInput] = useState(null);
    
    useEffect(() => {
        if (isModalOpen) {
            document.body.style.overflow = 'hidden';
            document.body.style.paddingRight = '15px';
        } else {
            document.body.style.overflow = 'unset';
            document.body.style.paddingRight = '0px';
        }

        return () => {
            document.body.style.overflow = 'unset';
            document.body.style.paddingRight = '0px';
        };
    }, [isModalOpen]);

    if (!isModalOpen) return null;

    const modalContent = (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 overscroll-none"
            style={{ 
                zIndex: 2147483647 
            }}
        >
            <div className="fixed inset-0 overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4">
                    <div 
                        className="relative transform overflow-hidden rounded-lg bg-white shadow-2xl transition-all w-full max-w-lg"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="border-b border-gray-200 px-4 py-3 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-900">Create Post</h2>
                            <button
                                onClick={toggleModal}
                                className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                            >
                                <span className="sr-only">Close</span>
                                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>

                        <div className="px-6 py-6">
                            <div className="flex items-start space-x-3">
                                <div className="flex-shrink-0">
                                    <img 
                                        src="/api/placeholder/40/40" 
                                        alt="User avatar" 
                                        className="h-10 w-10 rounded-full"
                                    />
                                </div>
                                <div className="flex-1">
                                    <div className="mb-2">
                                        <span className="font-semibold text-gray-900">User Name</span>
                                    </div>
                                    <textarea
                                        className="w-full rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 min-h-[120px] p-4 text-gray-900 placeholder-gray-400 resize-none transition duration-200"
                                        placeholder="What's on your mind?"
                                        value={textInput}
                                        onChange={(e) => setTextInput(e.target.value)}
                                    />
                                    <div className="mt-5">
                                        <label className="text-sm font-medium text-gray-600 mb-1 block">Add a photo:</label>
                                        <input
                                            type="file"
                                            onChange={(e) => setFileInput(e.target.files[0])}
                                            className="block w-full text-sm text-gray-500 cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 px-6 py-4">
                            <button
                                onClick={() => {
                                    if (textInput.trim()) {
                                        createPost(textInput, fileInput);
                                        setTextInput('');
                                        setFileInput(null);
                                        toggleModal();
                                    }
                                }}
                                disabled={!textInput.trim()}
                                className={`w-full rounded-lg px-4 py-3 text-sm font-semibold shadow-sm transition duration-150 ${
                                    textInput.trim() 
                                        ? 'bg-blue-600 text-white hover:bg-blue-700' 
                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }`}
                            >
                                Post
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return createPortal(
        modalContent,
        document.body
    );
}

export default PostInputCardModal;
