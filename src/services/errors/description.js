export const generateErrorInfo = user => {
    return `
    Una o mas propiedades están incompletos o no son válidas.
    Lista de propiedades obligatorias:
        - first_name: Must be a string. (${user.first_name})
        - last_name: Must be a string. (${user.last_name})
        - email: Must be a string. (${user.email})
    `
}