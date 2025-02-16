class ApiError extends Error {
    constructor(statusCode, message, errors = []) {
        super(message)
        this.statusCode = statusCode
        this.msg = message
        this.success = false
        this.errors = errors
    }
}

export { ApiError }