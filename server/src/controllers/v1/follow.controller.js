import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import userModel from "../../models/user.model.js";
import likeModel from "../../models/like.model.js";
import postModel from "../../models/post.model.js";
import followModel from "../../models/follow.model.js";
import { followValidation, handleValidationErrors } from "../../middlewares/validation.middleware.js";

import mongoose from "mongoose";


const followUnfollow = asyncHandler(async (req, res) => {
  const { userId } = req.payload //our userId (token)
  const { otherUserId } = req.params;

  let userFound = await userModel
    .findById(userId)
    .select("_id");

  // The user doesn't not exist in the DB.
  if (!userFound) {
    throw new ApiError(401, "User not found");
  }

  if (String(userId) == String(otherUserId)) {
    throw new ApiError(403, "You can't follow yourself");
  }


  let otherUserFound = await userModel
    .findById(otherUserId)
    .select("_id");

  // The user doesn't not exist in the DB.
  if (!otherUserFound) {
    throw new ApiError(401, "Other User not found");
  }


  //check if the user is followed
  const isFollowed = await followModel.findOne({
    followerId: userId,
    followeeId: otherUserFound._id
  }).select("_id");

  if (isFollowed) {
    await followModel.findOneAndDelete({
      followerId: userId,
      followeeId: otherUserFound._id
    });
    return res.status(200).json(new ApiResponse(200, "User Unfollowed"));
  }
  else {
    await followModel.create({
      followerId: userId,
      followeeId: otherUserFound._id
    });
    return res.status(201).json(new ApiResponse(201, "User Followed"));
  }

});


const getFollowers = asyncHandler(async (req, res) => {
  const { userId } = req.payload
  const { username } = req.params

  if (typeof username !== 'string' || username.trim() === '') {
    throw new ApiError(400, "Invalid username format");
  }
  console.log('received username', username)

  const userDocument = await userModel.findOne({ username }).select("_id");
  if (!userDocument) {
    throw new ApiError(404, "User not found");
  }

  const followeeId = userDocument._id; // Get the actual user ID from the username

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 2;


  const followersAggregation = followModel.aggregate(
    //get all followers

    [
      {
        $match: {
          // our userId
          followeeId: followeeId
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "followerId",
          foreignField: "_id",
          as: "followers",
          pipeline: [
            {
              $project: {
                _id: 1,
                followerId: "$_id",
                name: 1,
                username: 1,
                profileImg: 1,
                bio: 1
              }
            }
          ]
        }
      },
      {
        $unwind: {
          path: "$followers"
        }
      },
      {
        $lookup: {
          from: "follow",
          localField: "followerId",
          foreignField: "followeeId",
          as: "isFollowingdoc",
          pipeline: [
            {
              $match: {
                // our userId
                followerId: new mongoose.Types.ObjectId(userId)
              }
            }
          ]
        }
      },
      {
        $addFields: {
          isFollowing: {
            $cond: {
              if: {
                $gte: [
                  {
                    $size: "$isFollowingdoc"
                  },
                  1
                ]
              },
              then: true,
              else: false
            }
          }
        }
      },
      {
        $project: {
          _id: 1,
          name: "$followers.name",
          username: "$followers.username",
          profileImg: "$followers.profileImg",
          bio: "$followers.bio",
          userId: "$followers._id",
          createdAt: 1,
          isFollowing: 1
        }
      },
      {
        $sort: {
          createdAt: -1
        }
      }
    ]
  )


  let paginatedFollowers = await followModel.aggregatePaginate(followersAggregation, {
    page,
    limit
  })

  return res.status(201).json(new ApiResponse(201, "Successfull", paginatedFollowers));
});

// TODO (DONE): implement get Following
const getFollowing = asyncHandler(async (req, res) => {

  const { userId } = req.payload;
  const { username } = req.params;
  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 2


  if (typeof username !== 'string' || username.trim() === '') {
    throw new ApiError(400, "Invalid username format");
  }
  console.log('received username', username)


  let userFound = await userModel
    .findById(userId)
    .select("_id");

  // The user doesn't not exist in the DB.
  if (!userFound) {
    throw new ApiError(401, "User not found");
  }

  const userDocument = await userModel.findOne({ username }).select("_id");
  if (!userDocument) {
    throw new ApiError(404, "User not found");
  }

  const otherUserId = userDocument._id; // Get the actual user ID from the username
  console.log(otherUserId)

  const followingAggregation = followModel.aggregate([
    // get following
    {
      $match: {
        // other userId
        followerId: new mongoose.Types.ObjectId(otherUserId)
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "followeeId",
        foreignField: "_id",
        as: "followee"
      }
    },
    {
      $unwind: {
        path: "$followee"
      }
    },
    {
      $lookup: {
        from: "follow",
        localField: "followeeId",
        foreignField: "followeeId",
        as: "isFollowingdoc",
        pipeline: [
          {
            $match: {
              // our userId
              followerId: new mongoose.Types.ObjectId(userId)
            }
          }
        ]
      }
    },

    {
      $addFields: {
        isFollowing: {
          $cond: {
            if: {
              $gte: [
                {
                  $size: "$isFollowingdoc"
                },
                1
              ]
            },
            then: true,
            else: false
          }
        }
      }
    },
    {
      $project: {
        _id: 1,
        name: "$followee.name",
        username: "$followee.username",
        profileImg: "$followee.profileImg",
        bio: "$followee.bio",
        userId: "$followee._id",
        createdAt: 1,
        isFollowing: 1
      }
    },
    {
      $sort: {
        createdAt: -1
      }
    }
  ])

  let paginatedFollowing = await followModel.aggregatePaginate(followingAggregation, {
    page,
    limit
  });


  return res.status(201).json(new ApiResponse(201, "Following details", paginatedFollowing));

})

export {
  followUnfollow,
  getFollowers,
  getFollowing
}