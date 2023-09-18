import { Router } from 'express'
import CartManager from '../dao/cartManager.js'

const router = Router()
const cartManager = new CartManager('./carts.json')


// Ya en app.js se indica que la direccion es /products
router.get('/:cid', async (req, res) => {

    const cid = parseInt(req.params.cid)
    const result = await cartManager.getCart(cid)
    if (!result) return res.status(404).send({ status: 'error', error: 'Error! Cart was not found' })
    return res.status(200).json({ status: 'sucess', payload: result })
})

router.post('/', async (req, res) => {

    const result = await cartManager.addCart()
    if (!result) return res.status(400).send({ status: 'error', error: 'Error! The cart could not be added' })
    return res.status(201).json({ status: 'sucess', payload: result })
})

router.post('/:cid/product/:pid', async (req, res) => {

    const cid = parseInt(req.params.cid)
    const pid = parseInt(req.params.pid)
    const result = await cartManager.addProduct(cid, pid)
    if (typeof result == 'string') return res.status(400).send({ status: 'error', error: result })
    return res.status(201).json({ status: 'sucess', payload: result })
})


export default router