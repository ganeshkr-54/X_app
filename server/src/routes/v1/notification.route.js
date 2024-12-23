import express from "express";
import { getAllNotification } from '../../controllers/v1/notification.controller.js'
import verifyToken from "../../middlewares/verifyToken.middleware.js";
import { handleValidationErrors } from "../../middlewares/validation.middleware.js";

const router = express.Router()


// Get All Notification Paginated
router.get("/",
    verifyToken,
    getAllNotification
)



export default router