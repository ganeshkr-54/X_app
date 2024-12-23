// feedSlice.js
import { createSlice } from "@reduxjs/toolkit";

const feedSlice = createSlice({
    name: 'feedPosts',
    initialState: {
        feedForYou: [],
        followingForYou: [],
        comments: []
    },
    reducers: {
        SET_FORYOU_FEED: (state, action) => {
            state.feedForYou = [...state.feedForYou, ...action.payload]
        },
        REFRESH_FORYOU_FEED: (state, action) => {
            state.feedForYou = action.payload
        },
        SET_FOLLOWING_FEED: (state, action) => {
            state.followingForYou = [...state.followingForYou, ...action.payload]
        },
        REFRESH_FOLLOWING_FEED: (state, action) => {
            state.followingForYou = action.payload
        },
        ADD_POST_FOLLOWING_FEED: (state, action) => {
            state.feedForYou = [action.payload, ...state.feedForYou]
        },

        TOGGLE_LIKE: (state, action) => {
            const postId = action.payload;

            // Update ForYou feed
            state.feedForYou = state.feedForYou.map(post => {
                if (post._id === postId) {
                    return {
                        ...post,
                        isLiked: !post.isLiked,
                        likesCount: post.isLiked ? post.likesCount - 1 : post.likesCount + 1
                    };
                }
                return post;
            });

            // Update Following feed
            state.followingForYou = state.followingForYou.map(post => {
                if (post._id === postId) {
                    return {
                        ...post,
                        isLiked: !post.isLiked,
                        likesCount: post.isLiked ? post.likesCount - 1 : post.likesCount + 1
                    };
                }
                return post;
            });
        },

        TOGGLE_BOOKMARK: (state, action) => {
            const postId = action.payload;

            // Update ForYou feed
            state.feedForYou = state.feedForYou.map(post => {
                if (post._id === postId) {
                    return {
                        ...post,
                        isBookmarked: !post.isBookmarked
                    };
                }
                return post;
            });

            // Update Following feed
            state.followingForYou = state.followingForYou.map(post => {
                if (post._id === postId) {
                    return {
                        ...post,
                        isBookmarked: !post.isBookmarked
                    };
                }
                return post;
            });
        },

        SET_COMMENTS: (state, action) => {
            state.comments = [action.payload, ...state.comments];
            // increment commentCount for you and following
            state.feedForYou = state.feedForYou.map(post => {
                if (post._id === action.payload.postId) {
                    return {
                        ...post,
                        commentCount: post.commentCount + 1
                    };
                }
                return post;
            });
            state.followingForYou = state.followingForYou.map(post => {
                if (post._id === action.payload.postId) {
                    return {
                        ...post,
                        commentCount: post.commentCount + 1
                    };
                }
                return post;
        })
        },

        REFRESH_COMMENTS: (state, action) => {
            state.comments = action.payload;
        },

        DELETE_COMMENT: (state, action) => {
            state.comments = state.comments.filter(comment => comment._id !== action.payload.commentId);
            // decrement commentCount following and for you
            state.feedForYou = state.feedForYou.map(post => {
                if (post._id === action.payload.postId) {
                    return {
                        ...post,
                        commentCount: post.commentCount - 1
                    };
                }
                return post;
            });
            state.followingForYou = state.followingForYou.map(post => {
                if (post._id === action.payload.postId) {
                    return {
                        ...post,
                        commentCount: post.commentCount - 1
                    };
                }
                return post;
            });
        },

        DELETE_POST: (state, action) => {
            // check the postId and filter the for you and following feed
            state.feedForYou = state.feedForYou.filter(post => post._id !== action.payload);
            state.followingForYou = state.followingForYou.filter(post => post._id !== action.payload)
        },

    }
});

export const {
    SET_FOLLOWING_FEED,
    REFRESH_FOLLOWING_FEED,
    SET_FORYOU_FEED,
    REFRESH_FORYOU_FEED,
    ADD_POST_FOLLOWING_FEED,
    TOGGLE_LIKE,
    TOGGLE_BOOKMARK,
    SET_COMMENTS,
    REFRESH_COMMENTS,
    DELETE_COMMENT,
    DELETE_POST
} = feedSlice.actions;

export default feedSlice.reducer;