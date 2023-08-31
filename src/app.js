import express from 'express'
import { Server } from 'socket.io'
import handlebars from 'express-handlebars'
import productRouter from './routers/products.router.js'
import cartsRouter from './routers/carts.router.js'
import viewsRouter from './routers/views.router.js'
import ProductManager from './productManager.js'

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

app.use('/realtimeproducts', viewsRouter)

// App funciona como servidor web, escuchamos las peticiones en el puerto 8080
const httpsrv = app.listen(8080, () => console.log('Server is up !!'))
const socketServer = new Server(httpsrv)

const productManager = new ProductManager('./products.json')

socketServer.on('connection', async (socketClient) => {
    console.log(`Nuevo cliente conectado: ${socketClient.id}`)

    socketClient.on('con', async data => {
        let productsList = await productManager.getProducts()
        socketClient.emit('products', productsList)
    })

    socketClient.on('add', async product => {
        await productManager.addProduct(product)
        let productsList = await productManager.getProducts()
        socketClient.emit('products', productsList)
    })
    socketClient.on('deletePrd', async id => {
        await productManager.deleteProduct(id)
        let productsList = await productManager.getProducts()
        socketClient.emit('products', productsList)
    })
})



