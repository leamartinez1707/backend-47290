import express from 'express'
// import { Server } from 'socket.io'
import mongoose from 'mongoose'
import handlebars from 'express-handlebars'
import productRouter from './routers/products.router.js'
import cartsRouter from './routers/carts.router.js'
import viewsRouter from './routers/views.router.js'
// import ProductManager from './dao/productManager.js'

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

// productRouter se ejecuta solo cuando alguien ingresa a /products
app.use('/api/products', productRouter)
// cartsRouter se ejecuta solo cuando alguien ingresa a /carts
app.use('/api/carts', cartsRouter)

app.use('/', viewsRouter)

// App funciona como servidor web, escuchamos las peticiones en el puerto 8080
const httpsrv = app.listen(8080, () => console.log('Server is up !!'))

try {

    await mongoose.connect('mongodb+srv://leamartinez1707:leandro1707@elemcluster.qnq63c2.mongodb.net', {
        dbName: 'ecommerce'
    })
    console.log('conectado a la DB')
} catch (error) {
    console.log(error.message)

}


// const io = new Server(httpsrv)

// const productManager = new ProductManager('./products.json')



// io.on('connection', async (socket) => {
//     console.log(`Nuevo cliente conectado: ${socket.id}`)
//     const productsList = await productManager.getProducts()
//     socket.emit('products', productsList)

//     socket.on('add', async product => {
//         await productManager.addProduct(product)
//         const productsList = await productManager.getProducts()
//         io.emit('products', productsList)
//     })
//     socket.on('delete', async id => {
//         await productManager.deleteProduct(id)
//         let productsList = await productManager.getProducts()
//         io.emit('products', productsList)

//     })
// })





