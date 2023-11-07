import CartService from "../services/cartService.js";

const cartService = new CartService()

const getProductsFromCartController = async (req, res) => {
    const cid = req.params.cid
    const result = await cartService.getProductsFromCartService(cid)
    if (result.statusCode === 500) {
        return res.status(result.statusCode).send(result.response.error)
    }
    res.status(result.statusCode).send(result.response.payload)
}

const deleteFromCartController = async (req, res) => {
    const cid = req.params.cid
    const result = await cartService.deleteCartService(cid)
    if (result.statusCode === 500) {
        return res.status(result.statusCode).send(result.response.error)
    }
    res.status(result.statusCode).send(result.response.payload)
}

const updateCartController = async (req, res) => {
    const cid = req.params.cid
    const result = await cartService.updateCartService(cid)
    if (result.statusCode === 500) {
        return res.status(result.statusCode).send(result.response.error)
    }
    res.status(result.statusCode).send(result.response.payload)
}

const createCartController = async (req, res) => {
    const result = await cartService.createCartService()
    if (result.statusCode === 500) {
        return res.status(result.statusCode).send(result.response.error)
    }
    res.status(result.statusCode).send(result.response)
}

const addProductToCartController = async (req, res) => {
    const cid = req.params.cid
    const pid = req.params.pid

    const result = await cartService.addProductToCartService(cid, pid)

    if (result.statusCode === 500) {
        return res.status(result.statusCode).send(result.response.error)
    }
    res.status(result.statusCode).send(result.response.payload)
}

const deleteProductFromCartController = async (req, res) => {

    const cid = req.params.cid
    const pid = req.params.pid
    const result = await cartService.deleteProductFromCartService(cid, pid)
    if (result.statusCode === 500) {
        return res.status(result.statusCode).send(result.response.error)
    }
    res.status(result.statusCode).send(result.response.payload)
}

const updateProductFromCartController = async (req, res) => {
    const cid = req.params.cid
    const pid = req.params.pid
    const data = req.body.quantity
    const result = await cartService.updateProductFromCartService(cid, pid, data)
    if (result.statusCode === 500) {
        return res.status(result.statusCode).send(result.response.error)
    }
    res.status(result.statusCode).send(result.response)
}
export default { getProductsFromCartController, deleteFromCartController, updateCartController, createCartController, addProductToCartController, deleteProductFromCartController, updateProductFromCartController }