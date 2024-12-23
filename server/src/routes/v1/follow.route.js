import express from "express";
import { followUnfollow, getFollowers, getFollowing } from '../../controllers/v1/follow.controller.js'
import verifyToken from "../../middlewares/verifyToken.middleware.js";
import { followValidation,handleValidationErrors } from "../../middlewares/validation.middleware.js";

const router = express.Router()


// TODO: neccessary validations

router.post("/:otherUserId",
    verifyToken,
   followValidation(),
   handleValidationErrors,
    followUnfollow
)

router.get("/:username/followers",
    verifyToken,
    getFollowers,
)

router.get("/:username/followee",
    verifyToken,
    getFollowing
)



export default router