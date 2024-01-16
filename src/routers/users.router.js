import { Router } from 'express'
import UserModel from '../dao/models/user.model.js'
import { verifyRoles } from '../middlewares/auth.middlewares.js'
import { publicRoutes } from '../middlewares/auth.middlewares.js'
import logger from '../utils/logger.js'

const router = Router()

router.get('/premium/:uid', verifyRoles(['premium', 'user']), async (req, res) => {
    
    try {
        console.log(req.params.uid)
        let user = await UserModel.findOne({ _id: req.params.uid })
        if (!user) return res.redirect('/')
        console.log(user)
        await UserModel.findOneAndUpdate({ _id: user._id, role: user.role === 'user' ? 'premium' : 'user' })
        user = await UserModel.findOne({ _id: req.params.uid })
        logger.info(`El usuario ${user.email} cambió su rol! Ahora es: ${user.role}`)
        res.status(200).render('pageAuth', {
            message: 'Se actualizó el rol del usuario con éxito, para utilizarlo, cierre sesión e ingrese nuevamente!'
        })
    } catch (err) {
        res.status(500).json({ status: 'error', error: err.message })
    }
})
router.get('/addProduct', verifyRoles(['premium', 'admin']), async (req, res) => {

    res.render('actions/addProduct', {
        user: req.session.user
    })
})
router.get('/updateProduct', verifyRoles(['premium', 'admin']), async (req, res) => {

    res.render('actions/updateProduct', {
        user: req.session.user
    })
})



export default router