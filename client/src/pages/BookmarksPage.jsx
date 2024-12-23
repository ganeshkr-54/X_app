import React, { useState, useEffect } from 'react'
import API_INSTANCE from '../services/api.js';
import PostCard from '../components/PostCard';
import InfiniteScroll from 'react-infinite-scroll-component';
import BookMarkSearch from '../components/BookMarkSearch.jsx';
import {useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

let timeoutId;

function BookmarksPage() {
    const navigate = useNavigate()
    const [bookmarkedPost, setbookmarkedPost] = useState([]);
    const [searchPosts, setSearchPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedValue, setDebouncedValue] = useState(''); //searchTerm after N ms


    //add a setTimeout to update the debouncedValue state and as the state changes make an api call (search API)
    const fetchSearchedBookmarks = async () => {
        try {
            setIsLoading(true);
            const response = await API_INSTANCE.post(`/bookmark/search`, {
                searchQuery: debouncedValue
            });

            const searchResults = response.data.data.docs;
            setSearchPosts(searchResults);
        } catch (error) {
            console.error('Error searching bookmarks:', error);
            setSearchPosts([]); // Clear search results on error
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearchClick = async (searchQuery) => {
        clearTimeout(timeoutId) //this will clear the prev timeout
        setSearchQuery(searchQuery);

        timeoutId = setTimeout(() => {
            setDebouncedValue(searchQuery)
        }, 700)
    };

    async function fetchBookmarks() {
        try {
            setIsLoading(true);

            const response = await API_INSTANCE.get(`/bookmark?page=${page}&limit=10`);
            const newPosts = response.data.data.docs;
            const hasNextPage = response.data.data.hasNextPage;

            setbookmarkedPost(prevPosts => [...prevPosts, ...newPosts]);
            setHasMore(hasNextPage);

        } catch (error) {
            console.error("Error fetching bookmarks:", error);
            setIsError(error.message);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchBookmarks();
    }, [page]);

    useEffect(() => {
        if (!debouncedValue) { //""
            setSearchPosts([])
        }
        else {
            fetchSearchedBookmarks()
        }

    }, [debouncedValue])

    const fetchMoreData = () => {
        setPage((prevPage) => prevPage + 1);
    };

    if (isLoading && !bookmarkedPost.length) {
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
    if (isError) {
        return <div className="p-4 text-red-500">Error: {isError}</div>
    }
    if (!bookmarkedPost.length && !isLoading) {
        return <div className="p-4">No bookmarked posts found</div>
    }

    return (
        <div className='flex flex-col'>

            <div className="flex items-center mt-1.5  mb-2">
                <button
                    className="back-button flex items-center text-lg font-medium text-gray-600 mx-3"
                    onClick={() => navigate(`/home`)}
                >
                    <ArrowLeft className="mr-2 w-6 h-6" style={{ color: '#1DA1F2' }} />
                </button>
                <h1 className="text-xl font-bold">Bookmarks</h1>
            </div>

            <BookMarkSearch
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                handleSearchClick={handleSearchClick}
            />

            {searchPosts.length > 0 ? (
                searchPosts.map((post) => (
                    <PostCard
                        key={post._id}
                        postDetails={post}
                        isBookmarkPage={true}
                    />
                ))
            ) : (
                <InfiniteScroll
                    dataLength={bookmarkedPost.length}
                    next={fetchMoreData}
                    hasMore={hasMore}
                    loader={<h4>Loading more posts...</h4>}
                    endMessage={
                        <p style={{ textAlign: 'center' }}>
                            <b>Yay! You have seen it all</b>
                        </p>
                    }
                    pullDownToRefresh
                    pullDownToRefreshThreshold={50}
                    pullDownToRefreshContent={
                        <h3 style={{ textAlign: 'center' }}>↓ Pull down to refresh</h3>
                    }
                    releaseToRefreshContent={
                        <h3 style={{ textAlign: 'center' }}>↑ Release to refresh</h3>
                    }
                    refreshFunction={() => window.location.reload()}
                >
                    {bookmarkedPost.map((post) => (
                        <PostCard
                            key={post._id}
                            postDetails={{
                                ...post,
                                isBookmarked: true // Since it's in bookmarks page
                            }}
                            isBookmarkPage={true}
                        />
                    ))}
                </InfiniteScroll>
            )}
        </div>
    );
}

export default BookmarksPage;