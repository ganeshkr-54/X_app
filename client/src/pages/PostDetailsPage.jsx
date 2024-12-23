import React from 'react'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import PostCard from '../components/PostCard'
import CommentCard from '../components/CommentCard'
import CommentInputCard from '../components/CommentInputCard'
import API_INSTANCE from '../services/api'
import { SET_COMMENTS } from '../redux/slices/feedSlice'
import { useDispatch,useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

/*
TODO: postDetails page
get the postId from the params
fetch that post details using post by id API along with the comments of that post
and use PostCard and CommentCard Component
*/
function PostDetailsPage() {
    const comments = useSelector((state) => state.feedPosts.comments);
    const navigate= useNavigate()
    const { postId } = useParams()
    const dispatch =useDispatch()
    const [postDetails, setPostDetails] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)


    async function getPostById() {
        try {
            setLoading(true)
            const post_response = await API_INSTANCE.get(`/post/${postId}`)
            setPostDetails(post_response.data.data)
            setError(null)

        } catch (err) {
            console.error('Error fetching post:', err)
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    async function commentHandler(commentText) {
        try {
            const response = await API_INSTANCE.post(`/comment/${postId}`, {
                comment: commentText
            });

            
            toast.success('comment Added')
            const newComment = response.data.data;
            console.log(newComment)
            dispatch(SET_COMMENTS(newComment));
            setPostDetails(prev => ({
            ...prev,
            commentCount: prev.commentCount + 1
        }));
             

        } catch (error) {
            console.log("error in fetchBookmarks api : ", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (postId) {
            getPostById()
        }
    }, [postId])

    if (loading) return <div className="p-4">Loading...</div>
    if (error) return <div className="p-4 text-red-500">Error: {error}</div>
    if (!postDetails) return <div className="p-4">No post found</div>

    return (
        <div className='p-2 m-2'>
            <div className="flex items-center mt-1.5  mb-2">
            <button
              className="back-button flex items-center text-lg font-medium text-gray-600 mx-2"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="mr-2 w-6 h-6" style={{ color: '#1DA1F2' }} />
            </button>

            <h1 className="text-xl font-bold">Post</h1>

          </div>
            <PostCard postDetails={postDetails} />
            <CommentInputCard commentHandler={commentHandler} postDetails={postDetails}/>
            <CommentCard setPostDetails={setPostDetails}/>
        </div>
    )
}

export default PostDetailsPage