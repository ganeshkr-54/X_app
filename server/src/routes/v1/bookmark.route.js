import express from "express";
import { saveUnsavePost, getAllBookmarkPosts, bookmarkSearch } from '../../controllers/v1/bookmark.controller.js'
import verifyToken from "../../middlewares/verifyToken.middleware.js";
import multerUpload from "../../middlewares/multer.middleware.js"
import { bookmarkValidation, handleValidationErrors } from "../../middlewares/validation.middleware.js";
const router = express.Router()


// TODO: add a neccessary express validations (rida)


// TODO: search in bookmark on content field
router.post("/search",
    verifyToken,
    bookmarkSearch
)

// bookmark and unbookmark
router.post("/:postId",
    verifyToken,
    bookmarkValidation(),
    handleValidationErrors,
    saveUnsavePost
)

// DONE: get all bookmark post
router.get("/",
    verifyToken,
    getAllBookmarkPosts
)





export default router