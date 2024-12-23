import CONFIG from "../config/config.js";

const getStaticFilePath = (req) => {

    // Get the http or https protocol
    const protocol = req.protocol;

    // Get server's local IP address (the address on which the request was received)
    const host = req.hostname;

    // Get server's port number
    const port = req.socket.localPort || req.connection.localPort;

    console.log("-------------",req.file)

    // Get the request's path
    const fileName = req.file.filename;
    const fieldName = req.file.fieldname


    // http://localhost:3000/public/images/uploads/profile/filename.ext
    return `${protocol}://${host}:${port}${CONFIG.STATIC_PATH}${fieldName}/${fileName}`
}


const getLocalPath = (fileName, fieldName) => {

    return `uploads/${fieldName}/${fileName}`
}

export {
    getStaticFilePath,
    getLocalPath
}