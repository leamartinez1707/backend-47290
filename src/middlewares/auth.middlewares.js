import logger from "../utils/logger.js"

export const publicRoutes = (req, res, next) => {

    if (!req.session.user) return res.redirect('/')
    next()
}

export const privateRoutes = (req, res, next) => {

    if (req.session.user) return res.redirect('/products')
    next()
}

export const verifyRoles = (acceptedRoles) => {

    return (req, res, next) => {
        // El rol del usuario se almacena en req.user
        if (!req.user && acceptedRoles.includes('public')) {
            next()
        }
        if (!req.user) return res.status(400).render('pageError', { error: 'Debe iniciar sesión para ingresar a la página' })
        const userRole = req.user.role
        if (acceptedRoles.includes(userRole)) {
            next(); // El usuario tiene el rol necesario, permitir la solicitud
        } else {
            logger.error(`El usuario ${req.user.email} quiso ingresar a una página que tiene permisos.`)
            return res.status(403).render('pageAuth'); // 403 Forbidden si no tiene el rol necesario
        }
    };
};
