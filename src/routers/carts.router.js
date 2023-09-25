import { Router } from 'express'
import { cartModel } from '../dao/models/cart.model.js'
import { productModel } from '../dao/models/product.model.js'

const router = Router()

export const getProductsFromCart = async (req, res) => {
    try {
        const cid = req.params.cid
        let cart = await cartModel.findById(cid).populate('products.product').lean()
        if (!cart) {
            return {
                statusCode: 404, response: {
                    status: 'error', error: 'Cart was not found'
                }
            }
        } else {
            return {
                statusCode: 200,
                response: { status: 'success', payload: cart }
            }
        }
    } catch (error) {
        return {
            statusCode: 500,
            response: {
                status: 'error', error: error.message
            }
        }
    }
}

// Ya en app.js se indica que la direccion es /products
router.get('/:cid', async (req, res) => {

    let result = await getProductsFromCart(req, res)
    // let result = await cartModel.findById(cid).lean()
    // .populate('products.product')
    res.status(result.statusCode).json(result.response)
})

router.post('/', async (req, res) => {

    try {
        const result = await cartModel.create({})
        res.status(201).json({ status: 'success', payload: result })
    } catch (error) {
        res.status(500).json({ status: 'error', error: 'Error! The cart could not be added' })
    }
})

router.post('/:cid/product/:pid', async (req, res) => {
    // CORREGIR ESTO QUE ESTABA FUNCIONANDO
    try {
        const cid = req.params.cid
        const pid = req.params.pid
        let cart = await cartModel.findById(cid).lean()

        // let cart = await getProductsFromCart(cid)
        // .populate('products.product').lean()

        if (cart === null) return res.status(404).json({ status: 'error', error: `Cart "${cid}" was not found` })
        let product = await productModel.findById(pid).lean()
        if (product === null) return res.status(404).json({ status: 'error', error: `Product "${pid}" was not found` })
        let quantity = req.params.quantity || 1
        product = { product, quantity }

        // if (quantity !== Number) return res.status(400).json({ status: 'error', error: 'Quantity is not a number' })
        if (quantity === null) return res.status(400).json({ status: 'error', error: 'Quantity is null' })

        cart.products.push(product)

        const result = await cartModel.findByIdAndUpdate(cid, cart, { returnDocument: 'after' }).lean()
        // console.log(result)
        return res.status(201).json({ status: 'success', payload: result })

    } catch (err) {
        console.log(err.message)
    }
})

router.delete('/:cid/product/:pid', async (req,res) => {

    
})


export default router