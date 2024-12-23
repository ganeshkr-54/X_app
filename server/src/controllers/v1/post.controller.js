import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import userModel from "../../models/user.model.js";
import { getStaticFilePath, getLocalPath } from '../../utils/helpers.js'
import postModel from "../../models/post.model.js";
import fs from "node:fs/promises";
import followModel from "../../models/follow.model.js";
import mongoose from "mongoose";

// -----------------------------------------

const commonAggregationPost = []

// -----------------------------------------

// Create a post 
const createPost = asyncHandler(async (req, res) => {


    console.log("-------------------")
    console.log(req.body)
    console.log(req.file)
    console.log("-------------------")

    let { content } = req.body;
    let { userId } = req.payload;

    let userFound = await userModel
        .findById(userId)
        .select("_id username password name profileImg");

    if (!userFound) {
        throw new ApiError(401, "User not found");
    }

    // content OR image/video
    if (!content && !req.file) {
        throw new ApiError(403, "Please pass content or media")
    }

    let tempPost = {}

    if (content) {
        tempPost.content = content
    }

    if (req.file) {
        let mediaType = req.file.mimetype.split("/")[0];
        if (mediaType == 'image') {
            tempPost.image = getStaticFilePath(req)
        }
        else if (mediaType == 'video') {
            tempPost.video = getStaticFilePath(req)
        }
        tempPost.mediaLocalPath = getLocalPath(req.file.filename, req.file.fieldname);
    }

    tempPost.userId = userId;

    //save to db
    let savedPost = await postModel.create(tempPost)

    // "userId": "670884d5bb9c502c378230bc",
    //         "content": "video test",
    //         "image": "http://localhost:3000/public/images/posts/posts-1730170054781-183399543.jpg",
    //         "mediaLocalPath": "uploads/posts/posts-1730170054781-183399543.jpg",
    //         "likesCount": 0,
    //         "commentCount": 0,
    //         "_id": "67204cc625ce528c02784c7d",
    //         "createdAt": "2024-10-29T02:47:34.819Z",
    //         "updatedAt": "2024-10-29T02:47:34.819Z",
    //         "__v": 0

    // {
    //                 "_id": "67204fdec80f9fcbd22211de",
    //                 "userId": "670884d5bb9c502c378230bc",
    //                 "content": "FINAL TEST",
    //                 "image": "http://localhost:3000/public/images/posts/posts-1730170846710-484806085.png",
    //                 "likesCount": 0,
    //                 "commentCount": 0,
    //                 "createdAt": "2024-10-29T03:00:46.766Z",
    //                 "user": {
    //                     "_id": "670884d5bb9c502c378230bc",
    //                     "name": "abc",
    //                     "username": "abc",
    //                     "profileImg": "http://localhost:3000/public/images/profile/profile-1728611594397-485392539.jpg"
    //                 },
    //                 "isBookmarked": false,
    //                 "isLiked": false
    //             },

    let responseObject = {
        ...savedPost._doc,
        likesCount: 0,
        commentCount: 0,
        isBookmarked: false,
        isLiked: false,
        user: {
            _id: userFound._id,
            name: userFound.name,
            username: userFound.username,
            profileImg: userFound.profileImg
        }
    }



    res
        .status(200)
        .json(new ApiResponse(200, "Post Created", responseObject));
});



// Delete a post by ID
const deletePost = asyncHandler(async (req, res) => {

    let { userId } = req.payload;
    let { postId } = req.params;

    // Find the user
    let userFound = await userModel
        .findById(userId)
        .select("_id username password");

    if (!userFound) {
        throw new ApiError(401, "User not found");
    }

    // Find the post
    let postFound = await postModel
        .findOne({ _id: postId, userId: userFound._id });

    if (!postFound) {
        throw new ApiError(401, "Post not found");
    }

    //TODO (DONE): delete the image/video from the server as well (irfan) (TEST)
    // Check and delete the media files (image and video) if they exist
    const mediaPaths = [];

    // Add media paths for deletion if they are not null, undefined, or empty
    if (postFound.image && postFound.image !== '' && postFound.image !== null) {
        // FIX: local path push
        mediaPaths.push(postFound.mediaLocalPath); // Add image path to the array
    }

    if (postFound.video && postFound.video !== '' && postFound.video !== null) {
        // FIX: local path push
        mediaPaths.push(postFound.mediaLocalPath); // Add video path to the array
    }

    // remove the post from the DB
    await postModel.findOneAndDelete({ _id: postId });

    // Delete the media files from the server
    for (const mediaPath of mediaPaths) {
        await fs.unlink(mediaPath); // Delete the media file from the file system
    }

    // Send success response
    res.status(200).json(new ApiResponse(200, "Post Deleted Successfully"));
});


const getPostById = asyncHandler(async (req, res) => {

    let { userId } = req.payload;
    let { postId } = req.params

    // Find the user
    let userFound = await userModel
        .findById(userId)
        .select("_id");

    if (!userFound) {
        throw new ApiError(401, "User not found");
    }

    // likes collection matching postid, userid
    // isLiked true

    // Find the post
    let postFound = await postModel.aggregate(
        [
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(postId)
                }
            },
            // post Owner user Details
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    pipeline: [
                        {
                            $project: {
                                profileImg: 1,
                                username: 1,
                                name: 1
                            }
                        }
                    ],
                    as: "user"
                }
            },
            // isLiked
            {
                $lookup: {
                    from: "likes",
                    localField: "_id",
                    foreignField: "postId",
                    as: "likesDoc",
                    pipeline: [
                        {
                            $match: {
                                userId: new mongoose.Types.ObjectId(userId)
                            }
                        }
                    ]
                }
            },
            // isBookmarked
            {
                $lookup: {
                    from: "bookmarks",
                    localField: "_id", //local postId
                    foreignField: "postId",
                    as: "bookmarkedDoc",
                    pipeline: [
                        {
                            $match: {
                                bookmarkedBy: new mongoose.Types.ObjectId(userId)
                            }
                        }
                    ]
                }
            },
            // destructure the array
            {
                $unwind: {
                    path: "$user"
                }
            },
            {
                $addFields: {
                    isLiked: {
                        $cond: {
                            if: {
                                $gte: [{ $size: "$likesDoc" }, 1]
                            },
                            then: true,
                            else: false
                        }
                    },
                    isBookmarked: {
                        $cond: {
                            if: {
                                $gte: [{ $size: "$bookmarkedDoc" }, 1]
                            },
                            then: true,
                            else: false
                        }
                    }
                }
            },
            {
                $project: {
                    __v: 0,
                    updatedAt: 0,
                    bookmarkedDoc: 0,
                    likesDoc: 0,
                    mediaLocalPath: 0
                }
            }
        ]
    )

    // console.log(postFound)


    res
        .status(200)
        .json(new ApiResponse(200, "Post found successfull", postFound[0]));
});


const getAllPostByUserName = asyncHandler(async (req, res) => {

    let { userId } = req.payload;
    let { username } = req.params

    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 2
    const skip = (page - 1) * limit || 0;

    let userFound = await userModel
        .findById(userId)
        .select("_id username password");

    if (!userFound) {
        throw new ApiError(401, "User not found");
    }

    /*
    1. taking the username from req.params
    2. checking in user collection with that username exists or not
    3. if exists we are getting the userId (_id)
    4. with that _id will find the all the post
    */

    // check other user exists or not
    let otherUserFound = await userModel.findOne({ username }).select("_id");

    if (!otherUserFound) {
        throw new ApiError(401, "User doesn't exist");
    }

    // Method: non-aggregation pagination
    // let paginatedPosts = await postModel.find({ userId: String(otherUserFound._id) }).skip(skip).limit(limit).sort({ createdAt: -1 })


    // TODO (DONE): change this query to use mongoose aggregate paginate module
    let postAggregation = postModel.aggregate(
        [
            {
                $match: {
                    userId: otherUserFound._id //otherUserId
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    pipeline: [
                        {
                            $project: {
                                profileImg: 1,
                                username: 1,
                                name: 1
                            }
                        }
                    ],
                    as: "user"
                }
            },
            // isLiked
            {
                $lookup: {
                    from: "likes",
                    localField: "_id",
                    foreignField: "postId",
                    as: "likesDoc",
                    pipeline: [
                        {
                            $match: {
                                userId: new mongoose.Types.ObjectId(userId) //req.payload.userId
                            }
                        }
                    ]
                }
            },
            // isBookmarked
            {
                $lookup: {
                    from: "bookmarks",
                    localField: "_id", //local postId
                    foreignField: "postId",
                    as: "bookmarkedDoc",
                    pipeline: [
                        {
                            $match: {
                                bookmarkedBy: new mongoose.Types.ObjectId(userId) //req.payload.userId
                            }
                        }
                    ]
                }
            },
            // destructure the array
            {
                $unwind: {
                    path: "$user"
                }
            },
            {
                $addFields: {
                    isLiked: {
                        $cond: {
                            if: {
                                $gte: [{ $size: "$likesDoc" }, 1]
                            },
                            then: true,
                            else: false
                        }
                    },
                    isBookmarked: {
                        $cond: {
                            if: {
                                $gte: [{ $size: "$bookmarkedDoc" }, 1]
                            },
                            then: true,
                            else: false
                        }
                    }
                }
            },
            {
                $project: {
                    __v: 0,
                    updatedAt: 0,
                    bookmarkedDoc: 0,
                    likesDoc: 0,
                    mediaLocalPath: 0
                }
            },
            {
                $sort: {
                    createdAt: -1
                }
            }
        ]);


    let paginatedPosts = await postModel.aggregatePaginate(postAggregation, {
        page,
        limit
    })

    res
        .status(200)
        .json(new ApiResponse(200, "User Found", paginatedPosts));
});


const getAllPost = asyncHandler(async (req, res) => {

    let { userId } = req.payload;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 2;
    // const skip = (page - 1) * limit || 0;

    let userFound = await userModel
        .findById(userId)
        .select("_id username password");

    if (!userFound) {
        throw new ApiError(401, "User not found");
    }

    // Method: non-aggregation pagination
    // let paginatedPosts = await postModel.find({}).skip(skip).limit(limit).sort({ createdAt: -1 })


    //TODO DONE: $lookup stage: we need user profileimg, username and name of the user (everyone)
    // Method: aggregation pagination
    let postAggregation = postModel.aggregate([
        {
            $lookup: {
                from: "users",
                localField: "userId",
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
        // destructure the array
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "postId",
                as: "likeDetails",
                pipeline: [
                    {
                        $match: {
                            // our userId
                            userId: new mongoose.Types.ObjectId(userId)
                        }
                    }
                ]
            }
        },

        {
            $lookup: {
                from: "bookmarks",
                localField: "_id",
                foreignField: "postId",
                as: "bookmarkDetails",
                pipeline: [
                    {
                        $match: {
                            // our userId
                            bookmarkedBy: new mongoose.Types.ObjectId(userId)
                        }
                    }
                ]
            }
        },

        {
            $addFields: {
                isBookmarked: {
                    $cond: {
                        if: {
                            $gte: [
                                {
                                    $size: "$bookmarkDetails"
                                },
                                1
                            ]
                        },
                        then: true,
                        else: false
                    }
                },

                isLiked: {
                    $cond: {
                        if: {
                            $gte: [
                                {
                                    $size: "$likeDetails"
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
                likeDetails: 0,
                bookmarkDetails: 0,
                __v: 0,
                mediaLocalPath: 0,
                updatedAt: 0
            }
        },
        {
            $sort: {
                createdAt: -1
            }
        }
    ])

    let paginatedPosts = await postModel.aggregatePaginate(postAggregation, {
        page,
        limit
    })

    res
        .status(200)
        .json(new ApiResponse(200, "User Found", paginatedPosts));
});

// TODO (DONE): Need to get the all posts whom you follow (irfan)
const getAllPostByFollowing = asyncHandler(async (req, res) => {

    let { userId } = req.payload;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 2;

    let userFound = await userModel
        .findById(userId)
        .select("_id username password");

    if (!userFound) {
        throw new ApiError(401, "User not found");
    }

    const postByFollowingAggr = followModel.aggregate([
        {
            $match: {
                // our userId
                followerId: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $lookup: {
                from: "posts",
                localField: "followeeId",
                foreignField: "userId",
                as: "post",
                pipeline: [
                    {
                        $project: {
                            _id: 1,
                            userId: 1,
                            image: 1,
                            video: 1,
                            content: 1,
                            createdAt: 1,
                            likesCount: 1,
                            commentCount: 1,
                        }
                    }
                ]
            }
        },
        {
            $unwind: {
                path: "$post"
            }
        },
        // isLiked
        {
            $lookup: {
                from: "likes",
                localField: "post._id",
                foreignField: "postId",
                as: "likesDoc",
                pipeline: [
                    {
                        $match: {
                            // our userId
                            userId: new mongoose.Types.ObjectId(userId)
                        }
                    }
                ]
            }
        },
        // isBookmarked
        {
            $lookup: {
                from: "bookmarks",
                localField: "post._id", //local postId
                foreignField: "postId",
                as: "bookmarkedDoc",
                pipeline: [
                    {
                        $match: {
                            // our userId
                            bookmarkedBy: new mongoose.Types.ObjectId(userId)
                        }
                    }
                ]
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "post.userId", //local postId
                foreignField: "_id",
                as: "user",
                pipeline: [
                    {
                        $project: {
                            username: 1,
                            name: 1,
                            profileImg: 1,
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
            $addFields: {
                content: "$post.content",
                userId: "$post.userId",
                image: "$post.image",
                video: "$post.video",
                createdAt: "$post.createdAt",
                likesCount: "$post.likesCount",
                commentCount: "$post.commentCount",
                createdAt: "$post.createdAt",
                _id: "$post._id",

                isLiked: {
                    $cond: {
                        if: {
                            $gte: [{ $size: "$likesDoc" }, 1]
                        },
                        then: true,
                        else: false
                    }
                },

                isBookmarked: {
                    $cond: {
                        if: {
                            $gte: [{ $size: "$bookmarkedDoc" }, 1]
                        },
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            $project: {
                __v: 0,
                likesDoc: 0,
                bookmarkedDoc: 0,
                post: 0,
                followeeId: 0,
                followerId: 0,
                updatedAt: 0
            }
        },
        {
            $sort: {
                createdAt: -1
            }
        }
    ]);

    let paginatedPostsByFollowing = await followModel.aggregatePaginate(
        postByFollowingAggr,
        {
            page,
            limit
        }
    )

    res
        .status(200)
        .json(new ApiResponse(200, "Post by following...", paginatedPostsByFollowing));
});


export {
    createPost,
    deletePost,
    getPostById,
    getAllPostByUserName,
    getAllPost,
    getAllPostByFollowing
}