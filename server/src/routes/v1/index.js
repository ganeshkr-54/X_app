import express from "express";
import userRoutes from './user.route.js'
import postRoutes from './post.route.js'
import likeRoutes from './like.route.js'
import commentRoutes from './comment.route.js'
import bookmarkRoutes from './bookmark.route.js'
import followRoutes from './follow.route.js'
import notificationRoutes from './notification.route.js'

const router = express.Router()

router.use("/user", userRoutes)
router.use("/post", postRoutes)
router.use("/like", likeRoutes)
router.use("/comment", commentRoutes)
router.use("/bookmark", bookmarkRoutes)
router.use("/follow", followRoutes)
router.use("/notification", notificationRoutes)

export default router