import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import userModel from "../../models/user.model.js";
import CONFIG from "../../config/config.js"
import { getStaticFilePath } from '../../utils/helpers.js'
import postModel from "../../models/post.model.js";
import mongoose from "mongoose";
import commentModel from "../../models/comment.model.js";


const createComment = asyncHandler(async (req, res) => {

    let { userId } = req.payload;
    let { postId } = req.params;
    let { comment } = req.body;

    // Find the post
    let postFound = await postModel
        .findOne({ _id: postId })
        .select("commentCount");

    if (!postFound) {
        throw new ApiError(401, "Post not found");
    }

    let tempComment = {
        postId,
        author: userId,
        content: comment
    };

    let savedComment = await commentModel.create(tempComment);

    let responseObject = {
        _id: savedComment._id,
        content: savedComment.content,
        createdAt: savedComment.createdAt,
        user: {
            _id: req.user._id,
            name: req.user.name,
            username: req.user.username,
            profileImg: req.user.profileImg
        }
    }


    res
        .status(200)
        .json(new ApiResponse(200, "Comment Created", responseObject));
});

const deleteComment = asyncHandler(async (req, res) => {

    let { userId } = req.payload;
    let { commentId } = req.params;
    // let { postId } = req.body;

    // Find the user
    let userFound = await userModel
        .findById(userId)
        .select("_id");

    if (!userFound) {
        throw new ApiError(401, "User not found");
    }

    // Find the post
    // let postFound = await postModel
    //     .findById(postId)
    //     .select("_id");

    // if (!postFound) {
    //     throw new ApiError(401, "Post not found");
    // }

    // Find the comment
    let commentFound = await commentModel
        .findOne({ _id: commentId, author: userId })
        .select("_id postId");

    if (!commentFound) {
        throw new ApiError(401, "Comment not found");
    }

    // postFound.commentCount = postFound.commentCount - 1;

    await commentModel.findOneAndDelete({ _id: commentFound._id, postId: commentFound.postId });
    // await postFound.save();

    res
        .status(200)
        .json(new ApiResponse(200, "comment deleted"));
});


const getAllComments = asyncHandler(async (req, res) => {
    const { postId } = req.params;

    const { userId } = req.payload;

    const limit = Number(req.query.limit) || 2
    const page = Number(req.query.page) || 1

    let userFound = await userModel.findById(userId).select("_id");

    if (!userFound) {
        throw new ApiError(401, "User not found");
    }

    let postFound = await postModel.findById(postId).select("_id");
    if (!postFound) {
        throw new ApiError(404, "Post not found");
    }

    // stage1 : matching the postid
    // stage2 : get the author data with lookup stage
    // stage3 : sort the comment by latest created at -1

    const commentAggregation = commentModel.aggregate([
        {
            $match: {
                postId: new mongoose.Types.ObjectId(postId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "author",
                foreignField: "_id",
                as: "user",
                pipeline: [
                    {
                        $project: {
                            username: 1,
                            profileImg: 1,
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
                _id: 1,
                content: 1,
                "user._id": 1,
                "user.username": 1,
                "user.name": 1,
                "user.profileImg": 1,
                createdAt: 1
            }
        },
        {
            $sort: {
                createdAt: -1
            }
        }
    ]);

    let paginatedComments = await commentModel.aggregatePaginate(commentAggregation, {
        page,
        limit
    })

    res.status(200).json(new ApiResponse(200, "Comment fetched successfully", paginatedComments))
});


export {
    createComment,
    deleteComment,
    getAllComments
}