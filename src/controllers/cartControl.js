import { CartService, ProductService } from '../services/index.js'
import ticketModel from '../dao/models/ticket.model.js'
import { nanoid } from 'nanoid'

const getProductsFromCartController = async (req, res) => {
    const cid = req.params.cid
    const result = await CartService.getAll(cid)
    if (result.statusCode === 500) {
        return res.status(result.statusCode).send(result.response.error)
    }
    res.status(result.statusCode).send(result.response.payload)
}

const deleteFromCartController = async (req, res) => {
    const cid = req.params.cid
    const result = await CartService.delete(cid)
    if (result.statusCode === 500) {
        return res.status(result.statusCode).send(result.response.error)
    }
    res.status(result.statusCode).send(result.response.payload)
}

const updateCartController = async (req, res) => {
    const cid = req.params.cid
    const result = await CartService.update(cid)
    if (result.statusCode === 500) {
        return res.status(result.statusCode).send(result.response.error)
    }
    res.status(result.statusCode).send(result.response.payload)
}

const createCartController = async (req, res) => {
    const result = await CartService.create()
    if (result.statusCode === 500) {
        return res.status(result.statusCode).send(result.response.error)
    }
    res.status(result.statusCode).send(result.response)
}

const addProductToCartController = async (req, res) => {

    const cid = req.params.cid
    const pid = req.params.pid
    const result = await CartService.addToCart(cid, pid)
    if (result.statusCode === 500) {
        return res.status(result.statusCode).send(result.response.error)
    }
    res.status(result.statusCode).send(result.response.payload)
}

const deleteProductFromCartController = async (req, res) => {

    const cid = req.params.cid
    const pid = req.params.pid
    const result = await CartService.deleteProductFromCartService(cid, pid)
    if (result.statusCode === 500) {
        return res.status(result.statusCode).send(result.response.error)
    }
    res.status(result.statusCode).send(result.response.payload)
}

const updateProductFromCartController = async (req, res) => {
    const cid = req.params.cid
    const pid = req.params.pid
    const data = req.body.quantity
    const result = await CartService.updateProductFromCartService(cid, pid, data)
    if (result.statusCode === 500) {
        return res.status(result.statusCode).send(result.response.error)
    }
    res.status(result.statusCode).send(result.response)
}

const purchaseCartController = async (req, res) => {
    try {
        const cid = req.params.cid
        const resultCart = await CartService.getAll(cid)
        if (resultCart === null) {
            return res.status(404).send({ error: `Cart with ID: ${cid} was not found` })
        }
        const purchaseCart = resultCart.response.payload
        let productsAfterPurchase = purchaseCart.products
        let productsToTicket = []
        let amount = 0

        for (let index = 0; index < purchaseCart.products.length; index++) {

            let productToBuy = await ProductService.getById(purchaseCart.products[index].product)
            productToBuy = productToBuy.response.payload
            if (purchaseCart.products[index].quantity <= productToBuy.stock) {

                // Se verifica si la cantidad del producto a comprar es igual o menor al stock del producto
                // Se actualiza el stock del producto a comprar
                productToBuy.stock -= purchaseCart.products[index].quantity
                await ProductService.update(productToBuy._id, productToBuy)
                // Eliminamos del carrito todos los productos que se compraron y dejamos los que no tenian stock
                productsAfterPurchase = productsAfterPurchase.filter((prds) => prds.product._id.toString() !== purchaseCart.products[index].product._id.toString())
                // Calculamos el precio total de los productos, segun la cantidad comprada
                amount += (purchaseCart.products[index].quantity * productToBuy.price)
                // Agregamos el producto all Array del ticket
                productsToTicket.push({ product: productToBuy._id, price: productToBuy.price, quantity: purchaseCart.products[index].quantity })

            }
        }
        // Eliminamos los productos comprados, en MongoDB
        if (productsToTicket.length === 0) return res.status(400).render('pageError', { error: 'Su carrito de compra está vacio' })
        await CartService.update(cid, productsAfterPurchase, { returnDocument: 'after' })
        // Creamos el ticket de compra
        const ticket = await ticketModel.create({
            code: nanoid(),
            products: productsToTicket,
            amount,
            purchaser: req.session.user.email
        })
        console.log(productsAfterPurchase)
        return res.status(201).render('checkoutRes', {
            purchaseCode: ticket.code,
            noStockProducts: productsAfterPurchase,
            purchaseAmount: ticket.amount,
            purchaseBuyer: ticket.purchaser,
            purchaseSubTotal: ticket.amount * 0.8
        })
    } catch (error) {
        return res.status(500).send(error.message)
    }
}
export default { getProductsFromCartController, deleteFromCartController, updateCartController, createCartController, addProductToCartController, deleteProductFromCartController, updateProductFromCartController, purchaseCartController }