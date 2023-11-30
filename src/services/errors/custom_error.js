export default class CustomError {
    static createError({ name = "Error", cause, message, code }) {
        const error = new Error()
        error.name = name
        error.message = message
        error.cause = cause
        error.code = code
        return error
    }
}