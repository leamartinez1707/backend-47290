import express from 'express'
import { productModel } from './dao/models/product.model.js'
import { Server } from 'socket.io'
import mongoose from 'mongoose'
import handlebars from 'express-handlebars'
import productRouter from './routers/products.router.js'
import cartsRouter from './routers/carts.router.js'
import viewsRouter from './routers/views.router.js'


const app = express();

// Para cargar archivos en formato json con POST
app.use(express.json())

// Setear Handlebars
app.engine('handlebars', handlebars.engine())
app.set('views', './src/views')
app.set('view engine', 'handlebars')
// Permite leer los archivos de la carpeta public
app.use(express.static('./public'))

// Con esta expresion permitimos enviar datos POST desde un formulario HTML
// app.use(express.urlencoded({ extended: true }))

app.use('/', viewsRouter)
// productRouter se ejecuta solo cuando alguien ingresa a /products
app.use('/api/products', productRouter)
// cartsRouter se ejecuta solo cuando alguien ingresa a /carts
app.use('/api/carts', cartsRouter)
app.use('/products', viewsRouter)
app.use('/carts', viewsRouter)
// app.use('/chat', chatRouter)


try {

    // Conexion a la base de datos de Mongoose
    await mongoose.connect('mongodb+srv://leamartinez1707:leandro1707@elemcluster.qnq63c2.mongodb.net', {
        dbName: 'ecommerce'
    })
    console.log('conectado a la DB')

    // App funciona como servidor web, escuchamos las peticiones en el puerto 8080
    const httpsrv = app.listen(8080, () => console.log('Server is up !!'))

    const io = new Server(httpsrv)
    
    io.on('connection', async (socket) => {
        console.log(`Nuevo cliente conectado: ${socket.id}`)
        const productsList = await productModel.find().lean()
        socket.emit('products', productsList)

        socket.on('add', async product => {
            await productModel.create(product)
            const productsList = await productModel.find().lean()
            io.emit('products', productsList)
        })
        socket.on('delete', async id => {
            await productModel.deleteOne({ _id: id })
            let productsList = await productModel.find().lean()
            io.emit('products', productsList)

        })
    })
} catch (error) {
    console.log(error.message)

}







