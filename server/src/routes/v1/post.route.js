import express from "express";
import {
    createPost,
    deletePost,
    getPostById,
    getAllPostByUserName,
    getAllPost,
    getAllPostByFollowing
} from '../../controllers/v1/post.controller.js'
import verifyToken from "../../middlewares/verifyToken.middleware.js";
import multerUpload from "../../middlewares/multer.middleware.js"

const router = express.Router()


// TODO: add a neccessary express validations (rida)

// create post + verification + validation + single image/video + content
router.post("/",
    verifyToken,
    multerUpload.single('posts'),
    createPost
)

// delete by id 
router.delete("/:postId",
    verifyToken,
    deletePost)


router.get("/:postId",
    verifyToken,
    getPostById)


//get All post by username + pagination + https://www.npmjs.com/package/mongoose-paginate-v2
router.get("/user/:username",
    verifyToken,
    getAllPostByUserName)

// get all post (feed) + pagination
router.get("/feed/foryou",
    verifyToken,
    getAllPost)


// TODO: get all post of your following (feed) + pagination
router.get("/feed/following",
    verifyToken,
    getAllPostByFollowing)


export default router