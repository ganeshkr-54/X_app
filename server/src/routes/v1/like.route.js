import express from "express";
import { createLike } from "../../controllers/v1/like.controller.js";
import verifyToken from "../../middlewares/verifyToken.middleware.js";
import multerUpload from "../../middlewares/multer.middleware.js";
import { likePostValidation, handleValidationErrors } from "../../middlewares/validation.middleware.js";

const router = express.Router()




router.post("/:postId",

    verifyToken,
    likePostValidation(),
    handleValidationErrors,
    createLike
)



export default router