import express from 'express'
import mongoose from 'mongoose'
import MongoStore from 'connect-mongo'
import session from 'express-session'
import handlebars from 'express-handlebars'
import { Server } from 'socket.io'
import Sockets from './sockets.js'
import productRouter from './routers/products.router.js'
import cartsRouter from './routers/carts.router.js'
import viewsRouter from './routers/views.router.js'
import sessionViewRouter from './routers/sessionView.router.js'
import sessionRouter from './routers/session.router.js'
import chatRouter from './routers/chat.router.js'
import usersRouter from './routers/users.router.js'
import paymentsRouter from './routers/payments.router.js'
import config from './config/config.js'
import mockingRouter from './routers/mocking.router.js'
import errorHandler from './middlewares/errors.js'
import logger from './utils/logger.js'
import passport from 'passport'
import initializePassport from './config/passport.config.js'
import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUiExpress from 'swagger-ui-express'
import cors from 'cors'

const app = express();

app.use(session({
    store: MongoStore.create({
        mongoUrl: config.mongo_url,
        dbName: config.mongo_db_name
    }),
    secret: config.secretPass,
    resave: true,
    saveUninitialized: true
}))

initializePassport()
app.use(passport.initialize())
app.use(passport.session())
app.use(cors({
    origin: 'http://localhost:5173'
}))
// Para cargar archivos en formato json con POST
app.use(express.json())
// Con esta expresion permitimos enviar datos POST desde un formulario HTML
app.use(express.urlencoded({ extended: true }))

// Setear Handlebars
app.engine('handlebars', handlebars.engine())
app.set('views', './src/views')
app.set('view engine', 'handlebars')
// Permite leer los archivos de la carpeta public
app.use(express.static('./public'))

try {

    // Conexion a la base de datos de Mongoose
    await mongoose.connect(config.mongo_url, {
        dbName: config.mongo_db_name
    })
    logger.info('Conectado a la DB')
    const swaggerOptions = {
        definition: {
            openapi: '3.0.1',
            info: {
                title: "elem Shop | Tienda de ropa",
                description: "API pensada para una tienda de ropa."
            }
        },
        apis: ['./docs/**/*.yaml']
    }
    const specs = swaggerJSDoc(swaggerOptions);

    // App funciona como servidor web, escuchamos las peticiones en el puerto 8080
    const httpsrv = app.listen(config.port, () => logger.info(`Server is up at Port: ${config.port} !!`))

    const io = new Server(httpsrv)
    app.use((req, res, next) => {
        req.io = io
        next()
    })

    app.use('/', sessionViewRouter)
    app.use('/session', sessionRouter)
    app.use('/api/products', productRouter)
    app.use('/api/carts', cartsRouter)
    app.use('/api/users', usersRouter)
    app.use('/api/payments', paymentsRouter)
    app.use('/products', viewsRouter)
    app.use('/carts', viewsRouter)
    app.use('/users', viewsRouter)
    app.use('/chat', chatRouter)
    app.use('/mockingproducts', mockingRouter)
    app.use('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs))
    app.use(errorHandler)

    Sockets(io)


} catch (error) {
    logger.error(error.message)

}






