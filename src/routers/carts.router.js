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
    res.status(result.statusCode).json(result.response)
})
router.delete('/:cid', async (req, res) => {
    try {
        const cid = req.params.cid

        // BUSCAR EL CARRITO CON EL ID QUE SE LE PASO POR PARAMETRO
        let cart = await cartModel.findById(cid).lean()

        if (cart === null) return res.status(404).json({ status: 'error', error: `Cart "${cid}" was not found` })

        // CARRITO VACIO
        cart.products = []

        // ACTUALIZAR EL CARRITO EN LA BASE DE DATOS 
        const result = await cartModel.findByIdAndUpdate(cid, cart, { returnDocument: 'after' }).lean()

        return res.status(200).json({ status: 'success', payload: result })

    } catch (err) {
        return res.status(500).json({ status: 'error', payload: err.message })
    }
})
router.put('/:cid', async (req, res) => {

    // Deberá actualizar el carrito con un arreglo de productos con el formato especificado arriba.
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

router.delete('/:cid/product/:pid', async (req, res) => {

    try {
        const cid = req.params.cid
        const pid = req.params.pid

        // BUSCAR EL CARRITO CON EL ID QUE SE LE PASO POR PARAMETRO
        let cart = await cartModel.findById(cid).lean()

        if (cart === null) return res.status(404).json({ status: 'error', error: `Cart "${cid}" was not found` })

        // BUSCAR EL PRODUCTO QUE CONTENGA EL ID QUE SE LE PASO POR PARAMETRO
        let product = await productModel.findById(pid).lean()

        if (product === null) return res.status(404).json({ status: 'error', error: `Product "${pid}" was not found` })
        
        // ---> CREAR UNA VERIFICACION DONDE SI EL PRODUCTO NO ES ENCONTRADO DE UN ERROR

        // FILTRAR LOS PRODUCTOS DEL CARRITO Y ELIMINAR EL PRODUCTO OBTENIDO ANTERIORMENTE
        cart.products = cart.products.filter(prd => prd.product.toString() !== pid)

        if (!cart.products) return res.status(404).json({ status: 'error', error: `Product "${pid}" in cart ${cid} was not found` })

        // ACTUALIZAR EL CARRITO EN LA BASE DE DATOS, SIN EL PRODUCTO ANTERIORMENTE BORRADO
        const result = await cartModel.findByIdAndUpdate(cid, cart, { returnDocument: 'after' }).lean()

        return res.status(200).json({ status: 'success', payload: result })

    } catch (err) {
        return res.status(500).json({ status: 'error', payload: err.message })
    }

})
router.put('/:cid/product/:pid', async (req, res) => {
    // Deberá poder actualizar SÓLO la cantidad de ejemplares del producto por cualquier cantidad pasada desde req.body
})


export default router