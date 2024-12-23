import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import userModel from "../../models/user.model.js";
import likeModel from "../../models/like.model.js";
import postModel from "../../models/post.model.js";

import mongoose from "mongoose";
import notificationModel from "../../models/notification.model.js";


//TODO (DONE): implement get All Notification + Paginated 
const getAllNotification = asyncHandler(async (req, res) => {

  const { userId } = req.payload;
  const { page, limit } = req.query;

  let userFound = await userModel
    .findById(userId)
    .select("_id");

  // The user doesn't not exist in the DB.
  if (!userFound) {
    throw new ApiError(401, "User not found");
  }

  const notificationAggregation = notificationModel.aggregate([
    {
      $match: {
        // our userId
        postOwnerUserId: new mongoose.Types.ObjectId(userId)
      }
    },
    {
      $lookup: {
        from: "posts",
        localField: "postId",
        foreignField: "_id",
        as: "post",
        pipeline: [
          {
            $project: {
              _id: 1,
              content: 1,
              image: 1,
              video: 1
            }
          }
        ]
      }
    },
    {
      $unwind: {
        path: "$post",
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "interactedBy",
        foreignField: "_id",
        as: "user",
        pipeline: [
          {
            $project: {
              profileImg: 1,
              username: 1,
              name: 1
            }
          }
        ]
      }
    },
    {
      $unwind: {
        path: "$user"
      }
    },
    {
      $project: {
        content: "$post.content",
        image: "$post.image",
        video: "$post.video",
        type: 1,
        user: 1,
        createdAt: 1
      }
    },
    {
      $sort: {
        createdAt: -1
      }
    }
  ])

  let paginatedNotifications = await notificationModel.aggregatePaginate(notificationAggregation, {
    page,
    limit
  })

  return res.status(200).json(new ApiResponse(201, "Notification fetched successfully", paginatedNotifications));
});


export {
  getAllNotification
}