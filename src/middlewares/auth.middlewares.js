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
        // Supongamos que el rol del usuario se almacena en req.usuario. Puedes ajustarlo según tu implementación
        const userRole = req.user.role;
        if (acceptedRoles.includes(userRole)) {
            next(); // El usuario tiene el rol necesario, permitir la solicitud
        } else {
            res.status(403).json({ status: 'error', error: 'Acceso no autorizado para este rol' }); // 403 Forbidden si no tiene el rol necesario
        }
    };
};
