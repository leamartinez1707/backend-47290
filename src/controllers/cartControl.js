import CartService from "../services/cartService.js";

const cartService = new CartService()

const getProductsFromCart = async (req, res) => {
    const cid = req.params.cid
    console.log(cid)
    const result = await cartService.getPFC(cid)
    console.log(result.statusCode)
    if (result.statusCode === 500) {
        return res.status(result.statusCode).send(result.response.error)
    }
    res.send(result.response.payload)
}

const deleteFromCart = async (req, res) => {
    const cid = req.params.cid
    const result = await cartService.deleteC(cid)
    if (result.statusCode === 500) {
        return res.status(result.statusCode).send(result.response.error)
    }
    res.send(result.response.payload)
}

const updateCart = async (req, res) => {
    const cid = req.params.cid
    const result = await cartService.updateC(cid)
    if (result.statusCode === 500) {
        return res.status(result.statusCode).send(result.response.error)
    }
    res.send(result.response.payload)
}

const createCart = async (req, res) => {
    const result = await cartService.createC()
    console.log(result.response.payload)
    if (result.statusCode === 500) {
        return res.status(result.statusCode).send(result.response.error)
    }
    res.send(result.response)
}

const addProductToCart = async (req, res) => {
    const cid = req.params.cid
    const pid = req.params.pid

    const result = await cartService.addProductTC(cid, pid)

    if (result.statusCode === 500) {
        return res.status(result.statusCode).send(result.response.error)
    }
    res.status(result.statusCode).send(result.response.payload)
}

const deleteProductFC = async (req, res) => {

    const cid = req.params.cid
    const pid = req.params.pid
    const result = await cartService.deleteProductFCService(cid, pid)
    console.log(result)
    if (result.statusCode === 500) {
        return res.status(result.statusCode).send(result.response.error)
    }
    res.status(result.statusCode).send(result.response.payload)
}

const updateProductFC = async (req, res) => {
    const cid = req.params.cid
    const pid = req.params.pid
    const data = req.body.quantity
    const result = await cartService.updateProductFCService(cid, pid, data)
    console.log(result)
    if (result.statusCode === 500) {
        return res.status(result.statusCode).send(result.response.error)
    }
    res.status(result.statusCode).send(result.response)
}
export default { getProductsFromCart, deleteFromCart, updateCart, createCart, addProductToCart, deleteProductFC, updateProductFC }