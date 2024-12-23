import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import { useParams } from "react-router-dom"

import API_INSTANCE from "../services/api"
import FollowCard from "../components/FollowCard"
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

function FolloweePage() {

    const navigate = useNavigate();
    let { username } = useParams()
    const [followee, setFollowee] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    //TODO: add try catch
    async function fetchFollowees() {
        try {
            const response = await API_INSTANCE.get(`/follow/${username}/followee`)
            console.log(response.data)
            setFollowee(response.data.data.docs)
        }
        catch (error) {
            console.log(error.message)
        }
    }

    useEffect(() => {
        fetchFollowees()
    }, [])


    async function followUnfollowHandler(otherUserId) {
        try {
            setIsLoading(true);
            const response = await API_INSTANCE.post(`/follow/${otherUserId}`);

            //updating the following state
            setFollowee((prevFollowers) => {
                const updatedFollowers = followee.map(ele => {
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
                        <h2 className="text-xl font-bold">Following</h2>
                        <p className="text-sm text-gray-500">@{username}</p>
                    </div>
                </div>

                {followee.length <= 0 ? (
                    <div className="p-4 text-center text-gray-500">No Following</div>
                ) : (
                    followee.map((ele) => (
                        <FollowCard 
                            key={ele._id} 
                            user={ele} 
                            followUnfollowHandler={followUnfollowHandler} 
                        />
                    ))
                )}
            </div>
        </>
    )
}
export default FolloweePage
