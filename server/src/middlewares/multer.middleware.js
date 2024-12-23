import multer from 'multer'
import { ApiError } from '../utils/ApiError.js'

//TODO (DONE): add a check just to accept images and videos (irfan) (TEST)
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/' + file.fieldname + '/')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        const mediaExt = file.originalname.split('.')[1]
        cb(null, file.fieldname + '-' + uniqueSuffix + "." + mediaExt)
    }
})

// File filter to allow only images and videos
const fileFilter = function (req, file, cb) {

    const fileType = file.mimetype.split("/")[0]; // Check MIME type

    if (fileType == "image" || fileType == "video") {
        cb(null, true); // Accept the file
    } else {
        cb(new ApiError(415, "Invalid file type. Only images and videos are allowed!"), false); // Reject the file
    }
};

const upload = multer({ storage: storage, fileFilter: fileFilter })


export default upload

// req (object)
// req.body:   text fields from the form submission(if any), which are not file-related
// req.file:   upload.single() uploading a single file
// req.files:  upload.array() or upload.fields(). uploading multiple files 

// req.file
//  {
//     "fieldname": "profileImg",
//     "originalname": "example.jpg",
//     "encoding": "7bit",
//     "mimetype": "image/jpeg",
//     "destination": "uploads/profile/",
//     "filename": "profileImg-123456789.jpg",
//     "path": "uploads/profile/profileImg-123456789.jpg",
//     "size": 12345
//   }
