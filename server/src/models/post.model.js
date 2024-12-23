import mongoose from 'mongoose';
import CONFIG from '../config/config.js'
import aggregatePaginate from "mongoose-aggregate-paginate-v2";
import likeModel from './like.model.js';
import commentModel from './comment.model.js';
import notificationModel from './notification.model.js';
import bookmarkModel from './bookmark.model.js';
const { Schema } = mongoose


const postSchema = new mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    content: {
        type: String,
        default: ""
    },
    image: {
        type: String
    },
    video: {
        type: String
    },
    mediaLocalPath: {
        type: String,
        default: ""
    },
    likesCount: {
        type: Number,
        default: 0
    },
    commentCount: {
        type: Number,
        default: 0
    },
},
    { timestamps: true }
);

postSchema.plugin(aggregatePaginate);

postSchema.pre('save', async function (next) {
    next()
})

postSchema.post('save', (doc, next) => {
    console.log("-----------Running after saving to db")
    console.log(doc)
    console.log("------------------------------");
    next();
})


//TODO (DONE): need a post middleware if doc(post) gets deleted, delete all ref comments, likes, and bookmarks as well
postSchema.post('findOneAndDelete', async(doc, next) => {
    console.log("-----------Running after deleting from db");
    console.log(doc);
    console.log("------------------------------");

    await commentModel.deleteMany({ postId: doc._id });
    await likeModel.deleteMany({ postId: doc._id });
    await notificationModel.deleteMany({ postId: doc._id });
    await bookmarkModel.deleteMany({postId: doc._id});
    next();
})

export default mongoose.model('Post', postSchema, 'posts');