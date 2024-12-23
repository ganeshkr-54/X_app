import mongoose from 'mongoose';
import CONFIG from '../config/config.js'
import aggregatePaginate from "mongoose-aggregate-paginate-v2";
import postModel from "./post.model.js";
import notificationModel from './notification.model.js';
const { Schema } = mongoose


const bookmarkSchema = new mongoose.Schema({
    postId: {
        type: Schema.Types.ObjectId,
        ref: "Post"
    },
    bookmarkedBy: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    postContent: {
        type: String,
    }
},
    { timestamps: true }
);


// bookmarkSchema.createIndexes({ postContent: "text" })
// FIX: index problem
bookmarkSchema.index({ postContent: "text" });

bookmarkSchema.plugin(aggregatePaginate);

bookmarkSchema.pre('save', async function (next) {
    next()
})

bookmarkSchema.post('save', async (doc, next) => {
    console.log("-----------Running after saving to db(bookmark doc)");
    console.log(doc);
    console.log("------------------------------");

    next()
})



export default mongoose.model('Bookmark', bookmarkSchema, 'bookmarks')