import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import userModel from "../../models/user.model.js";
import likeModel from "../../models/like.model.js";
import postModel from "../../models/post.model.js";

import mongoose from "mongoose";


const createLike = asyncHandler(async (req, res) => {
    const { userId } = req.payload
    const { postId } = req.params


    let userFound = await userModel
        .findById(userId)
        .select("_id");

    // The user doesn't not exist in the DB.
    if (!userFound) {
        throw new ApiError(404, "User not found");
    }

    let postFound = await postModel
        .findById(postId)
        .select("_id likesCount");

    if (!postFound) {
        throw new ApiError(404, "Post not found");
    }

    //check if the post is liked by user
    const existingLike = await likeModel.findOne({ postId, userId }).select("_id");


    if (existingLike) {
        await likeModel.findOneAndDelete({ postId, userId });
        return res.status(200).json(new ApiResponse(200, "Post Unliked"));
    }
    else {
        await likeModel.create({ postId, userId });
        return res.status(201).json(new ApiResponse(201, "Post Liked"));
    }
});


export {
    createLike
}