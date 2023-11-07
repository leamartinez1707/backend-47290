import { productModel } from "./models/product.model.js";


export default class ProductDao {

    constructor() {
        this.model = productModel
    }

    getProducts = async () => {

        try {

            const paginate = productModel.find()
            return {
                statusCode: 200,
                response: {
                    status: 'success', payload: paginate
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
    getProductsDAO = async () => {
        let result = await this.getProducts()
        return result
    }
    getProductByIdDAO = async (pid) => {

        try {
            const result = await productModel.findOne({ _id: pid }).lean()
            
            if (!result || result === null) return {
                statusCode: 404,
                response: { status: 'error', error: 'Product does not exists' }
            }
            return {
                statusCode: 200,
                response: { status: 'success', payload: result }
            }
        } catch (error) {

            return {
                statusCode: 500,
                response: { status: 'success', error: error.message }
            }
        }
    }
    addProductDAO = async (product) => {

        try {
            let result = await productModel.create(product)
            if (!result) return {
                statusCode: 400,
                response: { status: 'error', error: 'The product could not be added' }
            }
            return {
                statusCode: 201,
                response: { status: 'success', payload: result }
            }
        } catch (err) {
            return {
                statusCode: 500,
                response: { status: 'error', error: err.message }
            }
        }

    }
    updateProductDAO = async (pid, productToUpdate) => {
        try {
            if (!productToUpdate.title || !productToUpdate.description || !productToUpdate.price || !productToUpdate.code || !productToUpdate.category || !productToUpdate.stock || !productToUpdate.thumbnail)
                return {
                    statusCode: 400,
                    response: { status: 'error', error: 'Incomplete values' }
                }
            let result = await productModel.updateOne({ _id: pid }, productToUpdate)
            if (!result) return {
                statusCode: 400,
                response: { status: 'error', error: 'The product could not be updated' }
            }
            return {
                statusCode: 200,
                response: { status: 'success', payload: result }
            }
        } catch (err) {
            return {
                statusCode: 500,
                response: { status: 'success', error: err.message }
            }
        }

    }
    deleteProductDAO = async (pid) => {
        try {
            let result = await productModel.deleteOne({ _id: pid })
            if (!result) return {
                statusCode: 400,
                response: { status: 'error', error: 'The product could not be deleted' }
            }
            return {
                statusCode: 200,
                response: { status: 'success', payload: result }
            }
        } catch (err) {
            return {
                statusCode: 500,
                response: { status: 'error', error: err.message }
            }
        }
    }
}