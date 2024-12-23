import { useState, useEffect } from "react"
import InfiniteScroll from "react-infinite-scroll-component"
import { toast } from "react-toastify"

import API_INSTANCE from "../services/api"
import FollowCard from "../components/FollowCard"
import { useParams } from "react-router-dom"
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

function FollowersPage() {

  const navigate = useNavigate();
  let { username } = useParams()

  const [followers, setFollowers] = useState([])
  const [hasMore, sethasMore] = useState(true)
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(false)

  //TODO: add try catch with page
  async function fetchFollowers() {
    try {
      const response = await API_INSTANCE.get(`/follow/${username}/followers?page=${page}&limit=10`)
      console.log(response.data)
      const newFollowers = response.data.data.docs
      console.log(newFollowers)
      setFollowers((prevFollowers) => [...prevFollowers, ...newFollowers])
      console.log(response.data.data.docs)
      setPage((prevPage) => prevPage + 1)
      sethasMore(response.data.data.hasNextPage)
    }
    catch (error) {
      console.log(error)
      setError(error.message)
    }
    finally {
      setIsLoading(false)
    }
  }


  async function followUnfollowHandler(otherUserId) {
    try {
      setIsLoading(true);
      const response = await API_INSTANCE.post(`/follow/${otherUserId}`);

      //updating the following state
      setFollowers((prevFollowers) => {
        const updatedFollowers = followers.map(ele => {
          if (ele.userId == otherUserId) {
            return {
              ...ele,
              isFollowing: response.data.message == 'User Unfollowed' ? false : true
            }
          }
          else {
            return {
              ...ele,
            }
          }
        })




        return updatedFollowers
      })

      toast(` ${response.data.message == 'User Unfollowed' ? 'User Unfollowed' : 'User followed'} `)

    } catch (error) {
      console.log("error in fetchBookmarks api : ", error);
    } finally {
      setIsLoading(false);
    }
  }



  useEffect(() => {
    fetchFollowers();
  }, [username])

  return (
    <>
        <div className="flex flex-col border w-100 h-screen overflow-auto overflow-x-hidden">
                {/* Header with back button */}
                <div className="flex items-center p-4 sticky top-0 bg-white/80 backdrop-blur-md border-b border-gray-200">
                    <button
                        className="flex items-center text-lg font-medium text-gray-600 mr-4"
                        onClick={() => navigate(`/${username}`)}
                    >
                        <ArrowLeft className="mr-2 w-6 h-6" style={{ color: '#1DA1F2' }} />
                    </button>
                    <div>
                        <h2 className="text-xl font-bold">Followers</h2>
                        <p className="text-sm text-gray-500">@{username}</p>
                    </div>
                </div>

                <InfiniteScroll
                    dataLength={followers.length}
                    next={fetchFollowers}
                    hasMore={hasMore}
                    loader={<h4>Loading...</h4>}
                    endMessage={
                        <p style={{ textAlign: 'center' }}>
                            <b>Yay! You have seen it all</b>
                        </p>
                    }
                >
                    {followers.map((follower) => (
                        <FollowCard 
                            key={follower._id} 
                            user={follower} 
                            followUnfollowHandler={followUnfollowHandler} 
                        />
                    ))}
                </InfiniteScroll>
            </div>
    </>
  )
}

export default FollowersPage