import { Router } from "express";
import passport from "passport";

const router = Router()


router.post('/register', passport.authenticate('register', { failureRedirect: '/session/failRegister' }), async (req, res) => {

    res.redirect('/')

})

router.post('/login', passport.authenticate('login', { failureRedirect: '/session/failRegister' }), async (req, res) => {

    if (!req.user) {
        return res.status(400).send({ status: 'error', error: 'Invalid credentials' })
    }
    if (req.user.email === 'adminCoder@coder.com' || req.user.password === 'adminCod3r123') {
        req.user.role = 'admin'
    } else {
        req.user.role = 'user'
    }
    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        email: req.user.email,
        age: req.user.age,
        role: req.user.role
    }
    res.redirect('/profile')
})


router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.log(err)
            res.status(500).render('pageError')
        } else res.redirect('/')

    })
})

router.get('/gitCallback', passport.authenticate('github', { failureRedirect: '/login' }), async (req, res) => {

    req.session.user = req.user
    res.redirect('/')
})

router.get('/github', passport.authenticate('github', { scope: ['user:email'] }), (req, res) => {

})




export default router;