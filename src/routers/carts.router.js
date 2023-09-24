import { Router } from 'express'
import CartManager from '../dao/cartManager.js'
import { cartModel } from '../dao/models/cart.model.js'
import { productModel } from '../dao/models/product.model.js'

const router = Router()
const cartManager = new CartManager('./carts.json')


// Ya en app.js se indica que la direccion es /products
router.get('/:cid', async (req, res) => {

    const cid = parseInt(req.params.cid)
    const result = await cartManager.getCart(cid)
    if (!result) return res.status(404).send({ status: 'error', error: 'Error! Cart was not found' })
    return res.status(200).json({ status: 'success', payload: result })
})

router.post('/', async (req, res) => {

    try {
        const result = await cartModel.create({})
        console.log(result)

        res.status(201).json({ status: 'success', payload: result })
    }

    catch (error) {
        res.status(500).json({ status: 'error', error: 'Error! The cart could not be added' })
    }
})

router.post('/:cid/product/:pid', async (req, res) => {

    try {
        const cid = parseInt(req.params.cid)
        const pid = parseInt(req.params.pid)
        const cart = await cartModel.findById(cid)
        if (cart === null) return res.status(404).json({ status: 'error', error: `Cart "${cid}" was not found` })
        const product = await productModel.findById(pid)
        if (product === null) return res.status(404).json({ status: 'error', error: `Product "${pid}" was not found` })

        let quantity = req.params.quantity
        if (quantity !== Number) return res.status(400).json({ status: 'error', error: 'Quantity is not a number' })
        if (quantity === null) return res.status(400).json({ status: 'error', error: 'Quantity is null' })

        cart.products.push(...product, quantity = quantity + 1)
        return res.status(201).json({ status: 'success', payload: cart })

    } catch (err) {
        console.log(err.message)
    }
})


export default router