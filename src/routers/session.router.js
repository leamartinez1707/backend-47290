import { Router } from "express";
import userModel from '../dao/models/user.model.js'
const router = Router()


router.post('/register', async (req, res) => {

    try {
        const { first_name, last_name, email, age, password, role } = req.body
        const result = await userModel.create({ first_name, last_name, email, age, password, role })

        res.redirect('/')
    } catch (error) {

        res.status(400).send({ status: 'error', error: 'The user could not be registed' })
    }
})

router.post('/login', async (req, res) => {

    let { email, password } = req.body
    const user = await userModel.findOne({ email, password }).lean().exec()
    if (!user) {
        res.redirect('/')
    }
    if (user.email === 'adminCoder@coder.com' || user.password === 'adminCod3r123') {
        user.role = 'admin'
    } else {
        user.role = 'user'
    }
    req.session.user = user
    res.redirect('/products')
})


router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.log(err)
            res.status(500).render('pageError')
        } else {
            res.redirect('/')
        }
    })
})






export default router;