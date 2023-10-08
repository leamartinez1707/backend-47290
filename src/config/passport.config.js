import passport from "passport";
import local from 'passport-local'
import UserModel from "../dao/models/user.model.js";
import GitHubStrategy from 'passport-github2'
import { createHash, validatePassword } from "../utils/utils.js";

// Libreria 
// Profesionalizando nuestro Login.

const localStrategy = local.Strategy


const initializePassport = () => {

    passport.use('register', new localStrategy({

        passReqToCallback: true,
        usernameField: 'email'
    }, async (req, username, password, done) => {

        const { first_name, last_name, email, age } = req.body
        try {
            const user = await UserModel.findOne({ email: username })
            if (user) {
                console.log(user + 'este es el user que ya existe')
                return done(null, false)
            }
            const newUser = { first_name, last_name, email, age, password: createHash(password) }
            console.log(newUser + 'este es el result creado')
            const result = await UserModel.create(newUser)
            return done(null, result)
        } catch (err) {
            console.log(err.message + 'este es el error')
            return done(err.message)
        }

    }))

    passport.use('login', new localStrategy({
        usernameField: 'email',
    }, async (username, password, done) => {
        try {
            const user = await UserModel.findOne({ email: username })
            if (!user) {
                return done(null, false)
            }
            if (!validatePassword(user, password)) return done(null, false)
            return done(null, user)
        } catch (err) {
            console.log(err.message + 'este es el error')
            return done(err.message)
        }
    }))
    passport.use('github', new GitHubStrategy({
        clientID: 'Iv1.311097ec463b4d35',
        clientSecret: 'e370926db53a61159edb07ad6e70bc0e4c6342b2',
        callbackUrl: 'http://localhost:8080/api/session/gitCallback'
    }, async (accessToken, refreshToken, profile, done) => {
        console.log(profile)
        try {
            const user = await UserModel.findOne({ email: profile._json.email })
            if (user) return done(null, user)
            const newUser = await UserModel.create({
                first_name: profile._json.name,
                last_name: '',
                email: profile._json.email,
                password: ''
            })
            return done(null, newUser)
        } catch (err) {
            return done('Error login with Github')
        }
    }))

    passport.serializeUser((user, done) => {
        done(null, user._id)

    })

    passport.deserializeUser(async (id, done) => {
        const user = await UserModel.findById(id)
        done(null, user)
    })


}

export default initializePassport