import { body, param, validationResult } from "express-validator";
import { ApiError } from "../utils/ApiError.js";

function userRegisterValidation() {
    return [
        body("email").isEmail().withMessage("Invalid Email")
            .notEmpty().withMessage("Email is required"),
        body("password")
            // .isStrongPassword()
            .notEmpty().withMessage("Password is required"),
        body("username").isAlphanumeric()
            .notEmpty().withMessage("Username is required"),
        body("name").isAlpha().withMessage('First name should only contain letters')
            .notEmpty().withMessage("Name is required")
    ];
}

function userLoginValidation() {
    return [
        body("username")
            .notEmpty().withMessage("Username is required"),
        body("password")
            .notEmpty().withMessage("Password is required")
    ];
}

function changePasswordValidation() {
    return [
        body("password")
            .notEmpty().withMessage("Password is required"),
        body("newPassword")
            .notEmpty().withMessage("New password is required")
    ]
}

function likePostValidation() {
    return [
        param("postId")
            .notEmpty().withMessage("PostId is required")
            .isMongoId().withMessage("Invalid Mongoose Id")

    ]
}
function CommentValidation() {
    return [
        param("postId")
            .notEmpty().withMessage("PostId is required")
            .isMongoId().withMessage("Invalid Mongoose Id"),

        body("comment")
            .notEmpty().withMessage("pass the comment")

    ]
}

function postIdCheck() {
    return [
        param('postId')
            .notEmpty().withMessage("PostId is required")
            .isMongoId().withMessage("Invalid Mongoose Id"),
    ]
}


function DeleteCommentValidation() {
    return [
        param("commentId")
            .notEmpty().withMessage("commentId is required")
            .isMongoId().withMessage("Invalid Mongoose Id"),
    ]
}

function bookmarkValidation() {
    return [
        param("postId")
            .notEmpty().withMessage("PostId is required")
            .isMongoId().withMessage("Invalid Mongoose Id")

    ]
}
function followValidation() {
    return [
        param("otherUserId")
            .notEmpty().withMessage("otherUserId is required")
            .isMongoId().withMessage("Invalid Mongoose Id")

    ]
}

function handleValidationErrors(req, res, next) {
    const errorsResult = validationResult(req);
    if (errorsResult.isEmpty()) {
        return next();
    }

    throw new ApiError(400, "Validation Error", errorsResult.array())
}



export {
    handleValidationErrors,
    userRegisterValidation,
    changePasswordValidation,
    userLoginValidation,
    likePostValidation,
    CommentValidation,
    bookmarkValidation,
    followValidation,
    DeleteCommentValidation,
    postIdCheck
};