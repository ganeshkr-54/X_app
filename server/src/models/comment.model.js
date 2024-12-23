import mongoose from 'mongoose';
import CONFIG from '../config/config.js'
import aggregatePaginate from "mongoose-aggregate-paginate-v2";
import postModel from "./post.model.js";
import notificationModel from './notification.model.js';
const { Schema } = mongoose

const commentSchema = new mongoose.Schema({
    postId: {
        type: Schema.Types.ObjectId,
        ref: "Post"
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    content: {
        type: String,
        required: true
    }
},
    { timestamps: true }
);

commentSchema.plugin(aggregatePaginate);

commentSchema.pre('save', function (next) {
    next()
});

// Increment the commentCount only if the document is newly created
commentSchema.post('save', async (doc, next) => {
    console.log("-----------Running after saving to db(comment doc)");
    console.log(doc);
    console.log("------------------------------");
    let postFound = await postModel
        .findByIdAndUpdate(doc.postId, { $inc: { commentCount: 1 } })
        .select("_id userId");

    let tempNotify = {
        postId: doc.postId,
        postOwnerUserId: postFound.userId,
        interactedBy: doc.author,
        type: "comment"
    }

    // TODO (DONE): create comment notification document
    await notificationModel.create(tempNotify);

    next();
});

// Post-hook to decrement commentCount after deleting a comment
commentSchema.post('findOneAndDelete', async (doc, next) => {
    console.log("-----------Running after deleting from db(comment doc)");
    console.log(doc);
    console.log("------------------------------");
    await postModel.findByIdAndUpdate(doc.postId, { $inc: { commentCount: -1 } });
    next();
});


export default mongoose.model('Comment', commentSchema, 'comments')