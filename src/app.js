import express from 'express'
import productRouter from './routers/products.router.js'
import cartsRouter from './routers/carts.router.js'

const app = express();

// Para cargar archivos en formato json con POST
app.use(express.json())

// Con esta expresion permitimos enviar datos POST desde un formulario HTML
// app.use(express.urlencoded({ extended: true }))

// productRouter se ejecuta solo cuando alguien ingresa a /products
app.use('/api/products', productRouter)
// cartsRouter se ejecuta solo cuando alguien ingresa a /carts
app.use('/api/carts', cartsRouter)

// Permite leer los archivos de la carpeta public
// app.use(express.static('./public'))

// App funciona como servidor web, escuchamos las peticiones en el puerto 8080
app.listen(8080, () => console.log('Server is up !!'))


