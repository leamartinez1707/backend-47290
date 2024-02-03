import dotenv from 'dotenv'
import program from '../utils/commands.js'

const opts = program.opts()
console.log(`Env = ${opts.mode}`)

dotenv.config({
    path: opts.mode === 'production' ? './.env.production' : './.env.development'
})

export default {
    admin_email: process.env.ADMIN_EMAIL,
    admin_password: process.env.ADMIN_PASSWORD,
    mongo_url: process.env.MONGO_URL,
    mongo_db_name: process.env.MONGODB_NAME,
    secretPass: process.env.SECRET,
    clientIDGit: process.env.CLIENT_ID_GITHUB,
    clientSecretGit: process.env.CLIENT_SECRET_GITHUB,
    callbackUrlGit: process.env.CLIENT_URL_GITHUB,
    persistence: process.env.PERSISTENCE,
    environment: opts.mode || process.env.ENVIRONMENT,
    port: opts.p || process.env.PORT || 8080,
    nodemailer_user: process.env.MAILER_USER,
    nodemailer_pass: process.env.MAILER_PASS
}