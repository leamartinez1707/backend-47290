import dotenv from 'dotenv'

dotenv.config()

export default {
    admin_email: process.env.ADMIN_EMAIL,
    admin_password: process.env.ADMIN_PASSWORD
}