import CartService from "../services/cartService.js";

const cartService = new CartService()

const getProductsFromCart = async (req, res) => {
    const cid = req.params.cid
    const result = await cartService.getPFC(cid)
    if (result.statusCode === 500) res.send(result.response.error)
    res.send(result.response.payload)
}

const deleteFromCart = async (req, res) => {
    const cid = req.params.cid
    const result = await cartService.deleteC(cid)
    if (result.statusCode === 500) res.send(result.response.error)
    res.send(result.response.payload)
}

const updateCart = async (req, res) => {
    const cid = req.params.cid
    const result = await cartService.updateC(cid)
    if (!result.statusCode != 200) res.send(result.response.error)
    res.send(result.response.payload)
}

const createCart = async (req, res) => {
    const result = await cartService.createC()
    console.log(result.response.payload)
    if(result.statusCode != 200) return 'Error al crear carrito'
    res.send(result)
}
export default { getProductsFromCart, deleteFromCart, updateCart, createCart }