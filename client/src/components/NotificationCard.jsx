import React from "react";
import { Heart, User, MessageCircle } from "lucide-react"

function NotificationCard({ notification }) {
  // console.log(notification)
  const { type, createdAt, user, postId } = notification

  const formattedDate = new Date(createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  switch (type) {
    case "like":
      return (


        <div className="notification-card w-[500px] h-50 p-4 mb-4 border-b border-gray-300">
          <div className="flex items-center">
            <Heart className="text-red-500 inline mr-2 fill= {red}" />

            <img src={user.profileImg} className="rounded-full w-12 h-12 mr-4 object-cover" />
          </div>

          <div>

            <p><b> {user.name} </b> liked your post</p>
            {/* <p className="text-gray-500">@{user.username}</p> */}
            <small>{formattedDate}</small>
          </div>

        </div>

      )
    case "comment":
      return (

        <div className="notification-card w-[500px] p-4 mb-4 border-b border-gray-300">
          <div className="flex items-center">
            <MessageCircle className="text-blue-500 inline mr-2 filled-icon" />

            <img src={user.profileImg} className="rounded-full w-12 h-12 mr-4 border-b border-gray-300 object-cover " />
          </div>
          <div>



            <p><b>{user.name} </b> commented on your post </p>
            {/* <p className="text-gray-500">@{user.username}</p> */}

            <small>{formattedDate}</small>
          </div>

        </div>


      )
    case "follow":
      return (

        <div className="notification-card w-[500px] p-4 mb-4 border-b border-gray-300">
          <div className="flex items-center">
            <User className="text-blue-500 inline mr-2 " />

            <img src={user.profileImg} className="rounded-full w-12 h-12 mr-4 border-b border-gray-300 object-cover " />

          </div>
          <div>

            <p><b> {user.name} </b> followed you</p>
            {/* <p className="text-gray-500">@{user.username}</p> */}
            <small>{formattedDate}</small>
          </div>

        </div>


      )
    default:
      return (
        <div>
          <p>{user.name} performed an action on your post </p>
          {/* <p className="text-gray-500">@{user.username}</p> */}
          <small>{new Date(createdAt).toLocaleString()}</small>
        </div>
      );
  }


};
export default NotificationCard