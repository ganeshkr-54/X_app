import React, { useState, useEffect } from 'react';
import API_INSTANCE from '../services/api';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { REFRESH_COMMENTS, DELETE_COMMENT } from '../redux/slices/feedSlice';
import { toast } from 'react-toastify';
import { formatDate } from '../utils/helpers';

function CommentCard({ setPostDetails }) {
  const dispatch = useDispatch();
  const comments = useSelector((state) => state.feedPosts.comments);
  const commentUser = useSelector((state) => state.auth.user.name);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const { postId } = useParams();

  async function fetchComments() {
    try {
      setIsLoading(true);
      const response = await API_INSTANCE.get(`/comment/${postId}?page=${page}&limit=10`);
      dispatch(REFRESH_COMMENTS(response.data.data.docs));
      setPage((prevPage) => prevPage + 1);
      setHasMore(response.data.data.hasNextPage);
    } catch (error) {
      console.error("Error fetching comments:", error);
      setIsError(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function deleteComment(id) {
    try {
      await API_INSTANCE.delete(`/comment/${id}`);
      dispatch(DELETE_COMMENT({
        commentId: id,
        postId: postId  // Already available from useParams
      }));
      setPostDetails(prev => ({
        ...prev,
        commentCount: prev.commentCount - 1
      }));

      // refreshComments();
      toast.success('Comment deleted')
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  }

  async function refreshComments() {
    try {
      setIsLoading(true);
      const response = await API_INSTANCE.get(`/comment/${postId}?page=1&limit=10`);
      dispatch(REFRESH_COMMENTS(response.data.data.docs));
      setPage(2);
      setHasMore(response.data.data.hasNextPage);
    } catch (error) {
      console.error("Error refreshing comments:", error);
      setIsError(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchComments();
  }, [postId]);

  return (
    <div className="max-w-xl mx-5 ml-14 bg-white rounded-lg shadow-md p-6">
      {isError && <div className="text-red-500">{isError}</div>}
      <InfiniteScroll
        dataLength={comments.length}
        next={fetchComments}
        hasMore={hasMore}
        loader={isLoading ? <h4>Loading...</h4> : null}
        scrollThreshold={0.5}
        endMessage={
          <p style={{ textAlign: 'center' }}>
            <b>Yay! You have seen it all</b>
          </p>
        }
        refreshFunction={refreshComments}
        pullDownToRefresh
        pullDownToRefreshThreshold={50}
        pullDownToRefreshContent={
          <h3 style={{ textAlign: 'center' }}>&#8595; Pull down to refresh</h3>
        }
        releaseToRefreshContent={
          <h3 style={{ textAlign: 'center' }}>&#8593; Release to refresh</h3>
        }
      >
        {comments.length > 0 ? (
          comments.map((ele) => (
            <div key={ele._id} className="mb-6 border-b border-gray-200 pb-4">
              <div className='flex justify-between'>
                <div>
                  <div className="flex items-center space-x-4">
                    <p className="font-semibold text-gray-700">{ele.user?.name || "Anonymous"}</p>
                  </div>
                  <p className="mt-2 text-gray-800">{ele.content || "No content"}</p>
                  <div className="mt-2 text-sm text-gray-500">
                    <p>{ele.createdAt ? formatDate(ele.createdAt): "Unknown date"} ago </p>
                  </div>
                </div>
                <div>
                  {ele.user?.name === commentUser &&
                    <button onClick={() => deleteComment(ele._id)}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                      </svg>
                    </button>
                  }
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center">No comments yet.</p>
        )}
      </InfiniteScroll>
    </div>
  );
}

export default CommentCard;
