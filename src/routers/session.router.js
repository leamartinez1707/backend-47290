import { Router } from "express";
import UserModel from '../dao/models/user.model.js'

const router = Router()


router.post('/register', async (req, res) => {


    let { first_name, last_name, email, age, password } = req.body
    await UserModel.create({ first_name, last_name, email, age, password })
    res.redirect('/')

})

router.post('/login', async (req, res) => {

    let { email, password } = req.body
    const user = await UserModel.findOne({ email, password }).lean().exec()

    if (!user) {
        return res.redirect('/')
    }
    if (user.email === 'adminCoder@coder.com' || user.password === 'adminCod3r123') {
        user.role = 'admin'
    } else {
        user.role = 'user'
    }
    req.session.user = user
    res.redirect('/')
})


router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.log(err)
            res.status(500).render('pageError')
        } else res.redirect('/')

    })
})






export default router;