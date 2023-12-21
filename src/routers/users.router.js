import { Router } from 'express'
import UserModel from '../dao/models/user.model.js'
import { verifyRoles } from '../middlewares/auth.middlewares.js'
import { publicRoutes } from '../middlewares/auth.middlewares.js'
import logger from '../utils/logger.js'

const router = Router()

router.get('/premium/:email', verifyRoles(['premium', 'user']), async (req, res) => {
    console.log('entro aca')
    try {
        let user = await UserModel.findOne({ email: req.params.email })
        if (!user) return res.redirect('/')
        await UserModel.findOneAndUpdate({ email: user.email, role: user.role === 'user' ? 'premium' : 'user' })
        user = await UserModel.findOne({ email: req.params.email })
        logger.info(`El usuario ${user.email} cambió su rol! Ahora es: ${user.role}`)
        res.status(200).render('pageAuth', {
            message: 'Se actualizó el rol del usuario con éxito, para utilizarlo, cierre sesión e ingrese nuevamente!'
        })
    } catch (err) {
        res.status(500).json({ status: 'error', error: err.message })
    }
})

export default router