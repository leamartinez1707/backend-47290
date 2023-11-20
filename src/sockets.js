import messageModel from './dao/models/message.model.js'
import { productModel } from './dao/models/product.model.js'


export default (io) => {
    io.on('connection', async socket => {
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
        socket.broadcast.emit('alert')
        let messages = await messageModel.find().lean().exec()
        socket.emit("logs", messages)
        socket.on("message", async data => {
            await messageModel.create(data)
            let messages = await messageModel.find().lean().exec()
            io.emit("logs", messages)
        })
    })
}