import mongoose from 'mongoose';
import CONFIG from '../config/config.js'
import aggregatePaginate from "mongoose-aggregate-paginate-v2";
import notificationModel from './notification.model.js';
const { Schema } = mongoose

const followSchema = new mongoose.Schema({
    // the one who follows
    followerId: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    // the one who is being followed
    followeeId: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
},
    { timestamps: true }
);

followSchema.plugin(aggregatePaginate);

followSchema.pre('save', function (next) {
    next()
});

followSchema.post('save', async(doc, next)=> {
    console.log("-----------Running after saving to db(follow doc)");
    console.log(doc);
    console.log("------------------------------");

    let tempNotify = {
        postId: null,
        postOwnerUserId: doc.followeeId,
        interactedBy: doc.followerId,
        type: "follow"
    }

    // TODO (DONE): create follow notification document
    await notificationModel.create(tempNotify);
    next();
})

export default mongoose.model('Follow', followSchema, 'follow')