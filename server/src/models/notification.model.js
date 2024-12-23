import mongoose from 'mongoose';
import CONFIG from '../config/config.js'
import aggregatePaginate from "mongoose-aggregate-paginate-v2";
const { Schema } = mongoose


const notificationSchema = new mongoose.Schema({
    postId: {
        type: Schema.Types.ObjectId,
        ref: "Post"
    },
    postOwnerUserId: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    interactedBy: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    type: {
        type: String,
    }
},
    { timestamps: true }
);


notificationSchema.plugin(aggregatePaginate);

notificationSchema.pre('save', async function (next) {
    next()
})

notificationSchema.post('save', (doc, next) => {
    console.log("-----------Running after saving to db")
    console.log(doc)
    console.log("------------------------------");
    next()
})



export default mongoose.model('Notification', notificationSchema, 'notifications')