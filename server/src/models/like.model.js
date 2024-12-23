import mongoose from 'mongoose';
import CONFIG from '../config/config.js';
import aggregatePaginate from "mongoose-aggregate-paginate-v2";
import postModel from './post.model.js';
import notificationModel from './notification.model.js'
const { Schema } = mongoose;


const likeSchema = new mongoose.Schema({
    postId: {
        type: Schema.Types.ObjectId,
        ref: "Post"
    },
    // one who liked
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
},
    { timestamps: true }
);

likeSchema.plugin(aggregatePaginate);

likeSchema.pre('save', async function (next) {
    next()
});

// doc sample
// {
//     postId: new ObjectId('670bed9a0424ade5ce990227'),
//     userId: new ObjectId('670be8dd203e2d1579cd00a9'),
//     _id: new ObjectId('670f45c811dd08b6df086336'),
//     createdAt: 2024-10-16T04:49:13.004Z,
//     updatedAt: 2024-10-16T04:49:13.004Z,
//     __v: 0
// }

// Increment the likesCount only if the document is newly created
likeSchema.post('save', async (doc, next)=> {
    console.log("-----------Running after saving to db(like doc)");
    console.log(doc);
    console.log("------------------------------");

    let postFound = await postModel
        .findByIdAndUpdate(doc.postId, { $inc: { likesCount: 1 } })
        .select("_id userId");

    let tempNotify = {
        postId: doc.postId,
        postOwnerUserId: postFound.userId,
        interactedBy: doc.userId,
        type: "like"
    }

    // TODO (DONE): create like notification document
    await notificationModel.create(tempNotify);
    next();
});

// Post-hook to decrement likesCount after deleting a comment
likeSchema.post('findOneAndDelete', async (doc, next)=> {
    console.log("-----------Running after deleting from db(like)");
    console.log(doc);
    console.log("------------------------------");
    await postModel.findByIdAndUpdate(doc.postId, { $inc: { likesCount: -1 } });
    next();
});


export default mongoose.model('Like', likeSchema, 'likes')