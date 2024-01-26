import { Router } from 'express'
import UserModel from '../dao/models/user.model.js'
import userControl from '../controllers/userControl.js'
import { verifyRoles } from '../middlewares/auth.middlewares.js'
import logger from '../utils/logger.js'
import multer from 'multer'

const router = Router()

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})
const uploader = multer({ storage })

router.get('/premium/:uid', verifyRoles(['premium', 'user']), async (req, res) => {

    try {
        let user = await UserModel.findOne({ _id: req.params.uid })
        if (!user) return res.redirect('/')
        await UserModel.findOneAndUpdate({ _id: user._id }, { role: user.role === 'user' ? 'premium' : 'user' })
        user = await UserModel.findOne({ _id: req.params.uid })
        logger.info(`El usuario ${user.email} cambió su rol! Ahora es: ${user.role}`)
        res.status(200).render('pageAuth', {
            message: 'Se actualizó el rol del usuario con éxito, para utilizarlo, cierre sesión e ingrese nuevamente!'
        })
    } catch (err) {
        res.status(500).json({ status: 'error', error: err.message })
    }
})
router.get('/', userControl.getUsers)

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
router.post('/premium/:uid', uploader.single('archivo'), async (req, res) => {

    try {
        const uid = req.params.uid
        if (!req.file) return res.status(400).json({ status: 'error', error: 'No hay archivo adjunto' })
        const user = await UserModel.findById(uid).lean()
        user.documents.name = req.file.filename
        user.documents.reference = `http://localhost:8080/${req.file.filename}`
        let archivo = req.file
        await UserModel.findByIdAndUpdate(uid, user)
        const userF = await UserModel.findById(uid).lean()
        console.log(userF)
        res.status(200).json({ status: 'success', payload: archivo })
    } catch (error) {
        res.status(500).json({ status: 'error', error: error })
    }

})
router.delete('/deleteInactiveUsers', userControl.deleteUsers)


export default router