import React from 'react'

function FollowCard({ user, followUnfollowHandler }) {
    return (
        <>
            <li key={user._id} className="mb-4 list-none">
                <div className="flex items-center border p-4 rounded-lg border-purple-900 gap-10">

                    <span className='flex items-center'>
                        <img src={user.profileImg} className="rounded-full w-12 h-12 mr-4" />
                        <strong>{user.name}</strong>
                        <p classsname="mr-6"> (@{user.username})</p>
                    </span>

                    {user.isFollowing ?
                        <button
                            className=" ml-auto rounded-full border w-28 border-black bg-black text-white "
                            onClick={() => followUnfollowHandler(user.userId)}
                        >
                            Following
                        </button>
                        :
                        <button
                            className=" ml-auto rounded-full border w-28 border-black text-black bg-white "
                            onClick={() => followUnfollowHandler(user.userId)}
                        >
                            Follow
                        </button>
                    }

                </div>
            </li>
        </>
    )
}

export default FollowCard