export default class CustomError {
    static createError({ name = "Error", cause, message, code }) {
        const error = new Error()
        
        error.message = message
        error.cause = cause
        
        return error
    }
}