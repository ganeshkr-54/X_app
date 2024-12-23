import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import PostCard from './PostCard';
import API_INSTANCE from '../services/api'
import InfiniteScroll from 'react-infinite-scroll-component';
import { useDispatch } from 'react-redux';
import { SET_FOLLOWING_FEED, REFRESH_FOLLOWING_FEED } from '../redux/slices/feedSlice';


function Following_Feed() {

  const dispatch = useDispatch()
  const posts = useSelector((state) => state.feedPosts.followingForYou);
  const comments = useSelector((state) => state.feedPosts.comments);

  // const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(null);
  const [page, setPage] = useState(1); // For pagination
  const [hasMore, setHasMore] = useState(false); // To track if more data exists

  // Need to fetch all posts
  // TODO: update the data in redux
  async function fetchPosts() {
    try {
      console.log("FOllowing API CALLEDD page", page)
      setIsLoading(true);

      const response = await API_INSTANCE.get(`post/feed/following?page=${page}&limit=10`);
      console.log(response.data)
      const newPosts = response.data.data.docs;
      // console.log("page:", page, "posts=>", newPosts, "sethasmore=>", hasMore)

      // setPosts((prevPosts) => [...prevPosts, ...newPosts]);
      dispatch(SET_FOLLOWING_FEED(newPosts))
      setPage((prevPage) => prevPage + 1); // Load the next page
      setHasMore(response.data.data.hasNextPage); // No more data to load

    } catch (error) {
      console.log("error in posts api : ", error);
      setIsError(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  // TODO: update the data in redux
  // Refresh to fetch fresh Data
  async function refreshPosts() {
    try {
      console.log("REFRESH CALLEDD")
      setIsLoading(true);

      const response = await API_INSTANCE.get(`post/feed/following?page=1&limit=10`);
      // console.log(response.data)
      const newPosts = response.data.data.docs;
      console.log("page:", page, "posts=>", newPosts, "sethasmore=>", hasMore)

      // setPosts(newPosts);
      dispatch(REFRESH_FOLLOWING_FEED(newPosts))
      setPage(2); // Load the next page
      setHasMore(response.data.data.hasNextPage); // No more data to load

    } catch (error) {
      console.log("error in posts api : ", error);
      setIsError(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (posts.length <= 0) {
      fetchPosts()
    }
  }, []);

  useEffect(()=>{
    if (comments.length > 0){
      refreshPosts();
    }
  },[comments])

  return (
    <>
      <InfiniteScroll
        dataLength={posts.length} //This is important field to render the next data
        next={fetchPosts}
        hasMore={hasMore}
        loader={<div class="flex flex-row gap-2">
          <div class="w-4 h-4 rounded-full bg-blue-700 animate-bounce"></div>
          <div class="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:-.3s]"></div>
          <div class="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:-.5s]"></div>
        </div>}
        scrollThreshold={0.5}
        endMessage={
          <p style={{ textAlign: 'center' }}>
            <b>Yay! You have seen it all</b>
          </p>
        }
        // below props only if you need pull down functionality
        refreshFunction={refreshPosts}
        pullDownToRefresh
        pullDownToRefreshThreshold={50}
        pullDownToRefreshContent={
          <h3 style={{ textAlign: 'center' }}>&#8595; Pull down to refresh</h3>
        }
        releaseToRefreshContent={
          <h3 style={{ textAlign: 'center' }}>&#8593; Release to refresh</h3>
        }
      >
        {posts.map((ele) => (
          <PostCard
            key={ele._id}
            postDetails={ele}
            feedType="following"
          />
        ))}
      </InfiniteScroll>
    </>
  )
}

export default Following_Feed