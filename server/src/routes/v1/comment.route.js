import express from "express";
import { createComment, deleteComment, getAllComments } from '../../controllers/v1/comment.controller.js'
import verifyToken from "../../middlewares/verifyToken.middleware.js";

import {
    CommentValidation,
    postIdCheck,
    DeleteCommentValidation,
    handleValidationErrors,
} from "../../middlewares/validation.middleware.js";

const router = express.Router()


// TODO: add a neccessary express validations (rida)

// create a comment 
router.post("/:postId",
    verifyToken,
    CommentValidation(),
    handleValidationErrors,
    createComment
)

// delete by id 
router.delete("/:commentId",
    verifyToken,
    DeleteCommentValidation(),
    handleValidationErrors,
    deleteComment
)

// get all comment by post id 
router.get("/:postId",
    verifyToken,
    postIdCheck(),
    handleValidationErrors,
    getAllComments
)





export default router