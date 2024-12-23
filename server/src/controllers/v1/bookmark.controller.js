import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import userModel from "../../models/user.model.js";
import CONFIG from "../../config/config.js"
import { getStaticFilePath } from '../../utils/helpers.js'
import postModel from "../../models/post.model.js";
import mongoose from "mongoose";
import bookmarkModel from "../../models/bookmark.model.js";



const saveUnsavePost = asyncHandler(async (req, res) => {

  const { userId } = req.payload;
  const { postId } = req.params;

  const userFound = await userModel.findById(userId).select("_id");


  // The user doesn't not exist in the DB.
  if (!userFound) {
    throw new ApiError(401, "User not found");
  }

  const postFound = await postModel.findById(postId).select("_id content");


  if (!postFound) {
    throw new ApiError(401, "Post not found");
  }


  //check if the post is already bookmarked by user
  const isBookmarked = await bookmarkModel
    .findOne({ postId: postFound._id, bookmarkedBy: userFound._id });

  if (isBookmarked)   // if already bookmarked, then remove it
  {
    await bookmarkModel.deleteOne({ postId: postFound._id, bookmarkedBy: userFound._id });
    res.status(200).json(new ApiResponse(200, "Bookmarked removed"));
  }
  else    // no previous bookmark, add a bookmark
  {
    await bookmarkModel.create({ postId: postFound._id, bookmarkedBy: userFound._id, postContent: postFound?.content });
    res.status(201).json(new ApiResponse(201, "Bookmarked"));
  }
});

const getAllBookmarkPosts = asyncHandler(async (req, res) => {
  const { userId } = req.payload;
  const { page } = req.query;
  const { limit } = req.query;

  let userFound = await userModel
    .findById(userId)
    .select("_id");

  if (!userFound) {
    throw new ApiError(401, "User not found");
  }

  const bookMarkAggregation = bookmarkModel.aggregate(
    [
      {
        $match: {
          //our userId
          bookmarkedBy: new mongoose.Types.ObjectId(userId)
        }
      },
      {
        $lookup: {
          from: "posts",
          localField: "postId",
          foreignField: "_id",
          as: "postdetails",
        }
      },
      {
        $unwind: {
          path: "$postdetails"
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "postdetails.userId",
          foreignField: "_id",
          as: "user",
          pipeline: [
            {
              $project: {
                name: 1,
                profileImg: 1,
                username: 1
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
        $lookup: {
          from: "likes",
          localField: "postId",
          foreignField: "postId",
          as: "likesdoc",
          pipeline: [
            {
              $match: {
                //our userId
                userId: new mongoose.Types.ObjectId(userId)
              }
            }
          ]
        }
      },
      {
        $addFields: {
          isLiked: {
            $cond: {
              if: {
                $gte: [
                  {
                    $size: "$likesdoc"
                  },
                  1
                ]
              },
              then: true,
              else: false
            }
          },
          isBookmarked: true,

          content: "$postdetails.content",
          image: "$postdetails.image",
          video: "$postdetails.video",
          likesCount: "$postdetails.likesCount",
          commentCount: "$postdetails.commentCount",

          bcreatedAt: "$createdAt",
          createdAt: "$postdetails.createdAt"
        }
      },
      {
        $project: {
          __v: 0,
          postdetails: 0,
          likesdoc: 0,
          bookmarkedBy: 0,
          updatedAt: 0,
          postContent: 0
        }
      },
      {
        $sort: {
          bcreatedAt: -1
        }
      }
    ]);

  let paginatedBookmarks = await bookmarkModel.aggregatePaginate(
    bookMarkAggregation,
    {
      page,
      limit,
    }
  );

  return res
    .status(200)
    .json(new ApiResponse(
      200,
      "Bookmarks fetched successfully",
      paginatedBookmarks
    ));

});


const bookmarkSearch = asyncHandler(async (req, res) => {
  const { userId } = req.payload;
  const { page, limit } = req.query;
  const { searchQuery } = req.body;
  console.log(req.body)

  let userFound = await userModel
    .findById(userId)
    .select("_id");

  if (!userFound) {
    throw new ApiError(401, "User not found");
  }

  const bookMarkAggregation = bookmarkModel.aggregate(
    [
      {
        $match: {
          $text: {
            $search: searchQuery //searchQuery
          }
        }
      },
      {
        $lookup: {
          from: "posts",
          localField: "postId",
          foreignField: "_id",
          as: "postdetails"
        }
      },
      {
        $unwind: {
          path: "$postdetails"
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "postdetails.userId",
          foreignField: "_id",
          as: "user",
          pipeline: [
            {
              $project: {
                username: 1,
                name: 1,
                profileImg: 1
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
        $lookup: {
          from: "likes",
          localField: "postId",
          foreignField: "postId",
          as: "likesdoc",
          pipeline: [
            {
              $match: {
                //our userId
                userId: new mongoose.Types.ObjectId(userId)
              }
            }
          ]
        }
      },
      {
        $addFields: {
          isLiked: {
            $cond: {
              if: {
                $gte: [
                  {
                    $size: "$likesdoc"
                  },
                  1
                ]
              },
              then: true,
              else: false
            }
          },

          isBookmarked: true,

          content: "$postdetails.content",
          image: "$postdetails.image",
          video: "$postdetails.video",
          likesCount: "$postdetails.likesCount",
          commentCount: "$postdetails.commentCount",

          bcreatedAt: "$createdAt",
          createdAt: "$postdetails.createdAt"
        }
      },
      {
        $project: {
          __v: 0,
          postdetails: 0,
          likesdoc: 0,
          bookmarkedBy: 0,
          updatedAt: 0,
          postContent: 0
        }
      },
      {
        $sort: {
          bcreatedAt: -1
        }
      }
    ]);

  let paginatedBookmarks = await bookmarkModel.aggregatePaginate(
    bookMarkAggregation,
    {
      page,
      limit,
    }
  );

  return res
    .status(200)
    .json(new ApiResponse(
      200,
      paginatedBookmarks.length ? "content searched successfully" : "No Bookmarks",
      paginatedBookmarks
    ));
}

);


export {
  saveUnsavePost,
  getAllBookmarkPosts,
  bookmarkSearch
}