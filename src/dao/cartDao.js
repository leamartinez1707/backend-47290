import cartModel from "./models/cart.model.js"
import { productModel } from '../dao/models/product.model.js'

export default class CartDao {

    constructor() {
        this.model = cartModel
        this.modelProduct = productModel
    }
    getProductsFromCartId = async (cid) => {
        try {
            // const cid = req.params.cid
            let cart = await this.model.findById(cid).populate('products.product').lean()
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
                    status: 'error', error: 'Cart was not found'
                }
            }
        }
    }

    getProductsFromCart = async (cid) => {
        let result = await this.getProductsFromCartId(cid)
        return result
    }

    deleteCart = async (cid) => {

        try {
            // BUSCAR EL CARRITO CON EL ID QUE SE LE PASO POR PARAMETRO
            let cart = await this.model.findById(cid).lean()
            // if (cart === null) return {
            //     statusCode: 404,
            //     response: {
            //         status: 'error', error: `Cart "${cid}" was not found`
            //     }
            // }
            // CARRITO VACIO
            cart.products = []

            // ACTUALIZAR EL CARRITO EN LA BASE DE DATOS 
            const result = await this.model.findByIdAndUpdate(cid, cart, { Document: 'after' }).lean()

            return {
                statusCode: 200,
                response: {
                    status: 'success', payload: result
                }
            }
            // return res.status(200).json({ status: 'success', payload: result })

        } catch (err) {
            return {
                statusCode: 500,
                response: {
                    status: 'error', error: `Cart ${cid} was not found`
                }
            }
        }
    }

    updateCart = async (cid) => {

        // Deberá actualizar el carrito con un arreglo de productos con el formato especificado arriba.
        try {

            // BUSCAR EL CARRITO CON EL ID QUE SE LE PASO POR PARAMETRO
            let cart = await this.model.findById(cid)
            if (cart === null) return {
                statusCode: 404,
                response: {
                    status: 'error', error: `Cart "${cid}" was not found`
                }

                // return res.status(404).json({ status: 'error', error: `Cart "${cid}" was not found` })
            }
            // CREAR UN NUEVO BODY DEL CARRITO CON LOS PARAMETROS PASADOS EN BODY
            let newCart = req.body

            // VALIDA SI EXISTE EL ARRAY DE PRODUCTOS NUEVO PASADO POR BODY
            if (!newCart.products) return {
                statusCode: 400,
                response: {
                    status: 'error', error: 'Field products is required'
                }
            }
            // res.status(400).json({ status: 'error', error: 'Field products is required' })

            // VALIDACIONES PARA VERIFICAR SI LOS DATOS DEL BODY SON CORRECTOS
            for (const prd of newCart.products) {

                if (!prd.hasOwnProperty('product') || !prd.hasOwnProperty('quantity')) return {
                    statusCode: 400,
                    response: {
                        status: 'error', error: 'The properties ID or Quantity are not valid'
                    }
                }
                // {
                //     return res.status(400).json({ status: 'error', error: 'The properties ID or Quantity are not valid' })
                // }
                if (prd.quantity === 0) return {
                    statusCode: 400,
                    response: {
                        status: 'error', error: 'Quantity cant be 0'
                    }
                }
                // return res.status(400).json({ status: 'error', error: 'Quantity cant be 0' })

                if (typeof prd.quantity !== 'number') return {
                    statusCode: 400,
                    response: {
                        status: 'error', error: 'Quantity must be a Number'
                    }
                }
                // return res.status(400).json({ status: 'error', error: 'Quantity must be a Number' })

                const prdToAdd = await this.modelProduct.findById(prd.product)
                if (prdToAdd === null) return {
                    statusCode: 400,
                    response: {
                        status: 'error', error: `Product with ID: ${prd.product} was not found`
                    }
                }
                // {
                //     return res.status(400).json({ status: 'error', error: `Product with ID: ${prd.product} was not found` })
                // }
            }
            // MODIFICO LOS PRODUCTOS ANTERIORES POR LOS NUEVOS PRODUCTOS
            cart.products = newCart.products;

            await this.model.findByIdAndUpdate(cid, cart, { Document: 'after' })
            cart = await this.model.findById(cid)
            return {
                statusCode: 200,
                response: {
                    status: 'success', payload: cart
                }
            }
            // res.status(200).json({ status: 'success', payload: result })
        } catch (err) {
            return {
                statusCode: 500,
                response: {
                    status: 'error', payload: err.message
                }

                // res.status(500).json({ status: 'error', payload: err.message })
            }
        }
    }

    createCart = async () => {
        try {
            const result = await this.model.create({})
            return {
                statusCode: 201,
                response: {
                    status: 'success', payload: result
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

    addProductToCart = async (cid, pid) => {
        try {

            let cart = await this.model.findById(cid).lean()

            if (cart === null) return {
                statusCode: 400,
                response: {
                    status: 'error', error: `Cart "${cid}" was not found`
                }
            }
            let product = await this.modelProduct.findById(pid).lean()

            if (product === null) return {
                statusCode: 400,
                response: { status: 'error', error: `Product "${pid}" was not found` }
            }

            let quantity = 1
            product = { product, quantity }

            if (quantity === null) return {
                statusCode: 400,
                response: { status: 'error', error: 'Quantity is null' }
            }
            let productIndex = cart.products.findIndex(prd => prd.product._id == pid)
            if (productIndex < 0) {
                cart.products.push(product)
            } else {
                cart.products[productIndex].quantity++
            }
            await this.model.findByIdAndUpdate(cid, cart, { Document: 'after' }).lean()
            cart = await this.model.findById(cid).lean()
            return {
                statusCode: 201,
                response: { status: 'success', payload: cart }
            }

        } catch (err) {
            return {
                statusCode: 500,
                response: { status: 'error', payload: err.message }
            }
        }
    }

    deleteProductFromCart = async (cid, pid) => {
        try {

            // BUSCAR EL CARRITO CON EL ID QUE SE LE PASO POR PARAMETRO
            let cart = await this.model.findById(cid).lean()

            if (cart === null) return {
                statusCode: 400,
                response: { status: 'error', error: `Cart "${cid}" was not found` }
            }

            // BUSCAR EL PRODUCTO QUE CONTENGA EL ID QUE SE LE PASO POR PARAMETRO
            let product = await this.modelProduct.findById(pid).lean()

            if (product === null) return {
                statusCode: 400,
                response: { status: 'error', error: `Product "${pid}" was not found` }
            }

            // ---> CREAR UNA VERIFICACION DONDE SI EL PRODUCTO NO ES ENCONTRADO DE UN ERROR

            // FILTRAR LOS PRODUCTOS DEL CARRITO Y ELIMINAR EL PRODUCTO OBTENIDO ANTERIORMENTE
            cart.products = cart.products.filter(prd => prd.product.toString() !== pid)

            if (!cart.products) return {
                statusCode: 400,
                response: { status: 'error', error: `Product "${pid}" in cart ${cid} was not found` }
            }

            // ACTUALIZAR EL CARRITO EN LA BASE DE DATOS, SIN EL PRODUCTO ANTERIORMENTE BORRADO
            await this.model.findByIdAndUpdate(cid, cart, { Document: 'after' }).lean()
            cart = await this.model.findById(cid).lean()
            return {
                statusCode: 200,
                response: { status: 'success', payload: cart }
            }

        } catch (err) {
            return {
                statusCode: 500,
                response: { status: 'error', payload: err.message }
            }
        }
    }

    updateProductFromCart = async (cid, pid, data) => {
        try {
            // BUSCAR EL CARRITO CON EL ID QUE SE LE PASO POR PARAMETRO
            let cart = await this.model.findById(cid)

            if (cart === null) {
                return {
                    statusCode: 400,
                    response: { status: 'error', error: `Cart "${cid}" was not found` }
                }
            }
            // ---> CREAR UNA VERIFICACION DONDE SI EL PRODUCTO NO ES ENCONTRADO, EMITA UN ERROR

            let productTest = await this.modelProduct.findById(pid)
            console.log(productTest._id)
            if (!productTest) return {
                statusCode: 400,
                response: { status: 'error', error: `Product with ID "${pid}" was not found` }
            }
            let productUpdate = cart.products.findIndex(prd => prd.product.toString() === pid)

            if (productUpdate < 0) return {
                statusCode: 400,
                response: { status: 'error', error: `Product "${pid}" in cart ${cid} was not found` }
            }

            console.log(productUpdate + 'index del producto ')
            let newQuantity = data

            if (newQuantity === 0) return {
                statusCode: 400,
                response: { status: 'error', error: 'Quantity value cant be 0' }
            }
            if (!newQuantity) return {
                statusCode: 400,
                response: { status: 'error', error: 'Quantity value is a required field' }
            }
            if (typeof newQuantity !== 'number') return {
                statusCode: 400,
                response: { status: 'error', error: 'Quantity must be a number' }
            }
            console.log(cart.products[productUpdate])
            cart.products[productUpdate].quantity = newQuantity

            // ACTUALIZAR EL CARRITO EN LA BASE DE DATOS, SIN EL PRODUCTO ANTERIORMENTE BORRADO
            let result = await this.model.findByIdAndUpdate(cid, cart, { Document: 'after' }).lean()
            cart = await this.model.findById(cid)
            if (!result) return {
                statusCode: 400,
                response: { status: 'error', error: 'Cart could not be updated' }
            }
            else return {
                statusCode: 200,
                response: { status: 'success', payload: cart }
            }

        } catch (err) {
            return {
                statusCode: 500,
                response: { status: 'error', payload: err.message }
            }
        }

    }
}
