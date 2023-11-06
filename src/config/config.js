import dotenv from 'dotenv'

dotenv.config()

export default {
    admin_email: process.env.ADMIN_EMAIL,
    admin_password: process.env.ADMIN_PASSWORD,
    mongo_url: process.env.MONGO_URL,
    mongo_db_name: process.env.MONGODB_NAME,
    secretPass: process.env.SECRET

}