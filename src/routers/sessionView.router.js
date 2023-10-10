import { Router } from "express";
import { privateRoutes, publicRoutes } from "../middlewares/auth.middlewares.js";


const router = Router()

router.get('/', privateRoutes, (req, res) => {

    res.render('sessions/login')
})

router.get('/register', privateRoutes, async (req, res) => {
    res.render('sessions/register')
})
router.get('/profile', publicRoutes, (req, res) => {

    res.render('sessions/profile', req.session.user)
})

router.get('/session/error', (req, res) => res.render('pageError'))

router.get('/session/errorRegister', (req, res) => {
    res.render('pageError', {
        error: 'No se pudo registrar el usuario'
    })
})

router.get('/session/errorLogin', (req, res) => {
    res.render('pageError', {
        error: 'Verifique que los datos del usuario sean correctos'
    })
})

export default router