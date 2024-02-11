import cartModel from "./models/cart.model.js"
import { productModel } from '../dao/models/product.model.js'

export default class CartDao {

    constructor() {
        this.model = cartModel
        this.modelProduct = productModel
    }
    getProductsFromCartId = async (cid) => {
        try {
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

    getAll = async (cid) => {
        let result = await this.getProductsFromCartId(cid)
        return result
    }

    delete = async (cid) => {

        try {
            // BUSCAR EL CARRITO CON EL ID QUE SE LE PASO POR PARAMETRO
            let cart = await this.model.findById(cid).lean()
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

        } catch (err) {
            return {
                statusCode: 500,
                response: {
                    status: 'error', error: `Cart ${cid} was not found`
                }
            }
        }
    }

    update = async (cid, data) => {

        // Deberá actualizar el carrito con un arreglo de productos con el formato especificado arriba.
        try {

            // BUSCAR EL CARRITO CON EL ID QUE SE LE PASO POR PARAMETRO
            let cart = await this.model.findById(cid).lean()
            if (cart === null) return {
                statusCode: 404,
                response: {
                    status: 'error', error: `Cart "${cid}" was not found`
                }
            }
            let products = data
            let newCart
            // CREAR UN NUEVO BODY DEL CARRITO CON LOS PARAMETROS PASADOS EN BODY
            // VALIDA SI EXISTE EL ARRAY DE PRODUCTOS NUEVO PASADO POR BODY
            if (!products) return {
                statusCode: 400,
                response: {
                    status: 'error', error: 'Products is required'
                }
            }
            newCart = products

            // VALIDACIONES PARA VERIFICAR SI LOS DATOS DEL BODY SON CORRECTOS
            for (const prd of newCart) {

                if (!prd.hasOwnProperty('product') || !prd.hasOwnProperty('quantity')) return {
                    statusCode: 400,
                    response: {
                        status: 'error', error: 'The properties ID or Quantity are not valid'
                    }
                }
                if (prd.quantity === 0) return {
                    statusCode: 400,
                    response: {
                        status: 'error', error: 'Quantity cant be 0'
                    }
                }
                if (typeof prd.quantity !== 'number') return {
                    statusCode: 400,
                    response: {
                        status: 'error', error: 'Quantity must be a Number'
                    }
                }
                const prdToAdd = await this.modelProduct.findById(prd.product).lean()
                if (prdToAdd === null) return {
                    statusCode: 400,
                    response: {
                        status: 'error', error: `Product with ID: ${prd.product} was not found`
                    }
                }
            }
            // MODIFICO LOS PRODUCTOS ANTERIORES POR LOS NUEVOS PRODUCTOS
            cart.products = newCart

            await this.model.findByIdAndUpdate(cid, cart, { Document: 'after' })
            cart = await this.model.findById(cid).lean()
            return {
                statusCode: 200,
                response: {
                    status: 'success', payload: cart.products
                }
            }
        } catch (err) {
            return {
                statusCode: 500,
                response: {
                    status: 'error', payload: err
                }
            }
        }
    }

    create = async () => {
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
                    status: 'error', error: `El carrito "${cid}" no fue encontrado`
                }
            }
            let product = await this.modelProduct.findById(pid).lean()

            if (product === null) return {
                statusCode: 400,
                response: { status: 'error', error: `El producto "${pid}" no fue encontrado` }
            }
            if (product.stock === 0) return {
                statusCode: 400,
                response: { status: 'error', error: `El producto no tiene stock disponible` }
            }

            let quantity = 1
            product = { product, quantity }

            if (quantity === null) return {
                statusCode: 400,
                response: { status: 'error', error: 'Especifique la cantidad para agregar' }
            }
            let productIndex = cart.products.findIndex(prd => prd.product._id == pid)
            if (productIndex >= 0) {
                // Verificar si la cantidad en el carrito más la cantidad a agregar supera el stock
                const newQuantity = cart.products[productIndex].quantity + quantity;
                if (newQuantity > product.product.stock) {
                    return {
                        statusCode: 400,
                        response: { status: 'error', error: 'No hay suficiente stock para agregar más unidades' }
                    }
                }

                // Actualizar la cantidad en el carrito
                cart.products[productIndex].quantity = newQuantity;
            } else {
                cart.products.push(product)
            }
            await this.model.findByIdAndUpdate(cid, cart, { Document: 'after' })
            cart = await this.model.findById(cid).lean()
            return {
                statusCode: 200,
                response: { status: 'success', payload: cart }
            }

        } catch (err) {
            return {
                statusCode: 500,
                response: { status: 'error', error: err.message }
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
                statusCode: 404,
                response: { status: 'error', error: `Product "${pid}" does not exist` }
            }

            // ---> CREAR UNA VERIFICACION DONDE SI EL PRODUCTO NO ES ENCONTRADO DE UN ERROR
            let filter = cart.products.find((prd) => prd.product.toString() === pid)
            // ---> CREAR UNA VERIFICACION DONDE SI EL PRODUCTO NO ES ENCONTRADO EN EL CARRITO DE UN ERROR
            if (!filter) return {
                statusCode: 404,
                response: { status: 'error', error: `Product "${pid}" was not found in cart "${cid}"` }
            }
            // FILTRAR LOS PRODUCTOS DEL CARRITO Y ELIMINAR EL PRODUCTO OBTENIDO ANTERIORMENTE
            cart.products = cart.products.filter(prd => prd.product.toString() !== pid)
            if (!cart.products) return {
                statusCode: 400,
                response: { status: 'error', error: `Product "${pid}" in cart ${cid} was not found` }
            }

            // ACTUALIZAR EL CARRITO EN LA BASE DE DATOS, SIN EL PRODUCTO ANTERIORMENTE BORRADO
            await this.model.findByIdAndUpdate(cid, cart, { Document: 'after' })
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
            let cart = await this.model.findById(cid).lean()
            if (cart === null || !cart) {
                return {
                    statusCode: 400,
                    response: { status: 'error', error: `Cart "${cid}" was not found` }
                }
            }
            // ---> CREAR UNA VERIFICACION DONDE SI EL PRODUCTO NO ES ENCONTRADO, EMITA UN ERROR

            let productTest = await this.modelProduct.findById(pid).lean()

            if (!productTest) return {
                statusCode: 400,
                response: { status: 'error', error: `Product with ID "${pid}" was not found` }
            }
            let productUpdate = cart.products.findIndex(prd => prd.product.toString() === pid)

            if (productUpdate < 0) return {
                statusCode: 400,
                response: { status: 'error', error: `Product "${pid}" in cart ${cid} was not found` }
            }


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

            cart.products[productUpdate].quantity = newQuantity

            // ACTUALIZAR EL CARRITO EN LA BASE DE DATOS, SIN EL PRODUCTO ANTERIORMENTE BORRADO
            let result = await this.model.findByIdAndUpdate(cid, cart, { Document: 'after' }).lean()

            cart = await this.model.findById(cid).lean()
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
                response: { status: 'error', payload: err }
            }
        }

    }
}
