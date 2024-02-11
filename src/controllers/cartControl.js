import { CartService, ProductService } from '../services/index.js'
import ticketModel from '../dao/models/ticket.model.js'
import { nanoid } from 'nanoid'
import nodemailer from 'nodemailer'
import config from '../config/config.js'
import logger from '../utils/logger.js'

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
    console.log(result)
    if (result.statusCode === 500) {
        return res.status(result.statusCode).send(result.response.error)
    }
    res.status(result.statusCode).send(result.response.payload)
}

const updateCartController = async (req, res) => {
    const data = req.body.products
    const cid = req.params.cid
    const result = await CartService.update(cid, data)
    console.log(result)
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
    const cart = await CartService.getAll(cid)
    const product = await ProductService.getById(pid)
    if (cart.statusCode === 500 || cart.statusCode === 400 || cart.statusCode === 404) return res.status(400).json({ status: 'error', error: cart.response.error })
    // VALIDA QUE EL CARRITO Y EL PRODUCTO EXISTAN SEGUN LOS PARAMETROS OBTENIDOS
    if (product.statusCode === 500 || product.statusCode === 400 || product.statusCode === 404) return res.status(400).json({ status: 'error', error: product.response.error })

    // SI EL USUARIO TIENE UN ROL PREMIUM, VERIFICA QUE NO ESTÉ COMPRANDO UN PRODUCTO CREADO POR ÉL.
    if (req.session.user.role === 'premium') {
        if (product.response.payload.owner === req.session.user.email) {
            return res.status(403).json({ status: 'error', error: 'No puedes comprar tus propios productos!' })
        }
    }
    const result = await CartService.addToCart(cid, pid)
    if (result.statusCode === 500 || result.statusCode === 400) {
        return res.status(result.statusCode).json({ status: 'error', error: result.response.error })
    }
    res.status(result.statusCode).send(result.response.payload)
}

const deleteProductFromCartController = async (req, res) => {

    const cid = req.params.cid
    const pid = req.params.pid
    const result = await CartService.deleteProductFromCartService(cid, pid)
    if (result.statusCode === 500 || result.statusCode === 400 || result.statusCode === 404) {
        return res.status(result.statusCode).send(result.response.error)
    }
    res.status(result.statusCode).send(result)
}

const updateProductFromCartController = async (req, res) => {
    const cid = req.params.cid
    const pid = req.params.pid
    const data = req.body.quantity
    const result = await CartService.updateProductFromCartService(cid, pid, data)
    if (result.statusCode === 500) {
        return res.status(result.statusCode).send(result)
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
                productsToTicket.push({ product: productToBuy._id, title: productToBuy.title, price: productToBuy.price, quantity: purchaseCart.products[index].quantity })
            }
            // if (purchaseCart.products[index].quantity > productToBuy.stock && productToBuy.stock !== 0) {
            //     // Se verifica si la cantidad del producto es mayor a la cantidad que hay en stock

            //     amount += (productToBuy.stock * productToBuy.price)
            //     // Eliminamos del carrito todos los productos que se compraron y dejamos los que no tenian stock
            //     productsAfterPurchase = productsAfterPurchase.filter((prds) => prds.product._id.toString() == purchaseCart.products[index].product._id.toString())
            //     // Agregamos el producto al Array del ticket
            //     productsToTicket.push({ description: productToBuy.description, title: productToBuy.title, price: productToBuy.price, quantity: productToBuy.stock })
            //     // Se actualiza el stock del producto a comprar
            //     productToBuy.stock = 0
            //     await ProductService.update(productToBuy._id, productToBuy)
            // }
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

        const mailConfig = {
            service: 'gmail',
            auth: { user: config.nodemailer_user, pass: config.nodemailer_pass }
        }
        let transporter = nodemailer.createTransport(mailConfig)
        // Construir el cuerpo del mensaje con detalles de los productos
        const messageBody = productsToTicket.map(prd => `
        <tr>
        <td>${prd.title} </td>
        <td>${prd.quantity}</td>
        <td>$ ${prd.price * prd.quantity}</td>
        </tr>
        `).join('\n');

        let email = req.session.user.email
        let message = {
            from: config.nodemailer_user,
            to: email,
            subject: '[ elem Shop ] Orden de compra',
            html: `<h1>[Orden de compra] eleM | Tienda de ropa online</h1>
            <hr />
            <h2> Usted a realizado una compra en nuestra tienda </h2>
            <h3>Número de ticket: ${ticket.code}</h3>
            <h3>Total de la compra: $ ${ticket.amount}</h3>
            <h3>Cantidad de productos: ${ticket.products.length}</h3>
            <h3> Detalles de los productos: </h3>
            <style>
            table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
            }
            th, td {
            border: 1px solid #dddddd;
            text-align: left;
            padding: 8px;
            }
            th {
            background-color: #f2f2f2;
            }
            </style>
            <table>
            <thead>
            <tr>
            <th>Título</th>
            <th>Cantidad</th>
            <th>Total</th>
            </tr>
            </thead>
            <tbody>
            ${messageBody}
            </tbody>
            </table>
            <hr />
            <br>
            <br>
            Saludos,<br><strong>Equipo de eleM Uruguay.</strong>`
        }
        await transporter.sendMail(message)
        logger.info(`El usuario ${email} a realizado una compra de $ ${ticket.amount * 1.2}`)
        return res.status(200).render('checkoutRes', {
            user: req.session.user,
            purchaseCode: ticket.code,
            noStockProducts: productsAfterPurchase,
            purchaseBuyer: ticket.purchaser,
            purchaseAmount: Math.round(ticket.amount * 1.2),
            message: `Mensaje enviado a ${email}.`
        })
    } catch (error) {
        return res.status(500).send(error.message)
    }
}
export default { getProductsFromCartController, deleteFromCartController, updateCartController, createCartController, addProductToCartController, deleteProductFromCartController, updateProductFromCartController, purchaseCartController }