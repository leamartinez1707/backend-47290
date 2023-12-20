import { Router } from "express";
import passport from "passport";
import nodemailer from 'nodemailer'
import logger from '../utils/logger.js'
import UserModel from '../dao/models/user.model.js'
import UserPasswordModel from '../dao/models/user_password.model.js'
import { generateRandomString, createHash } from '../utils/utils.js'
import config from "../config/config.js";


const router = Router()

router.post('/register', passport.authenticate('register', {
    failureRedirect: '/session/errorRegister',
    successRedirect: '/session/registerAccepted'
}), async (req, res) => {

})

router.post('/login', passport.authenticate('login', { failureRedirect: '/session/errorLogin' }), async (req, res) => {

    if (!req.user) {
        res.status(400).send({ status: 'error', error: error.message })
    }
    if (req.user.email == 'adminCoder@coder.com') {
        req.session.user = {
            email: req.user.email,
            role: req.user.role,
            first_name: req.user.first_name
        }
    } else {
        req.session.user = {
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            email: req.user.email,
            age: req.user.age,
            role: req.user.role,
            cart: req.user.cart
        }
    }
    logger.info(`Usuario ${req.user.email} ha ingresado con éxito en la web`)

    res.redirect('/products')

})


router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            logger.error(err)
            res.status(500).render('pageError')
        } else res.redirect('/')

    })
})

router.get('/gitCallback', passport.authenticate('github', { failureRedirect: '/session/errorLogin' }), async (req, res) => {

    req.session.user = req.user
    logger.info(`Usuario ${req.user.email} ha ingresado con éxito en la web`)
    res.redirect('/')
})

router.get('/github', passport.authenticate('github', { scope: ['user:email'] }), (req, res) => {

})

router.post('/forget_password', async (req, res) => {
    const email = req.body.email
    const user = await UserModel.findOne({ email })
    if (!user) return res.status(400).send({ status: 'error', error: error.message })
    const token = generateRandomString(16)
    await UserPasswordModel.create({ email, token })
    const mailConfig = {
        service: 'gmail',
        auth: { user: config.nodemailer_user, pass: config.nodemailer_pass }
    }
    let transporter = nodemailer.createTransport(mailConfig)
    let message = {
        from: config.nodemailer_user,
        to: email,
        subject: '[Nueva contraseña] eleM | Tienda de ropa',
        html: `<h1>[Nueva contraseña] eleM | Tienda de ropa</h1>
        <hr />
        Has pedido un reinicio de contraseña. Lo puedes hacer desde el siguiente link: <a href="http://${req.hostname}:${config.port}/reset_password/${token}"
        >http://${req.hostname}:${config.port}/reset_password/${token}</a>
        <hr />
        Saludos,<br><strong>Equipo de eleM Uruguay.</strong>`
    }
    try {
        await transporter.sendMail(message)
        res.json({ status: 'success', message: `Mensaje enviado correctamente a ${email} para reiniciar su contraseña` })
    } catch (err) {
        res.status(500).json({ status: 'error', error: err.message })
    }
})

router.get('/verify_token/:token', async (req, res) => {
    try {
        const userPass = await UserPasswordModel.findOne({ token: req.params.token })
        // if (!userPass) {
        //     return res.status(404).json({ status: 'error', error: 'Token no valido o expiró' })
        // }
        const user = userPass.email

        res.render('sessions/reset_password', { user })
    } catch (err) {
        return res.status(404).json({ status: 'error', error: 'Token no valido o expiró' })
    }
})

router.post('/reset_password/:user', async (req, res) => {

    try {
        const user = await UserModel.findOne({ email: req.params.user })

        let filter = await UserPasswordModel.findOne({ email: user.email })
        if (!filter) return res.status(404).render('pageError', {
            error: 'El token ya fue utilizado o expiró, intente restablecer su contraseña nuevamente!'
        })
        await UserModel.findByIdAndUpdate(user._id, { password: createHash(req.body.newPassword) })
        res.status(200).json({ status: 'success', message: 'Se ha creado una nueva contraseña' })
        await UserPasswordModel.deleteOne({ email: req.params.user })
    } catch (err) {
        res.status(500).json({ status: 'error', error: err.message })
    }
})






export default router;