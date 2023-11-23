import { ProductService } from '../services/index.js'
import CustomError from '../services/errors/custom_error.js'
import EErros from '../services/errors/enums.js'
import { generateErrorInfo, generateErrorInfoTwo } from '../services/errors/description.js'

const getProducts = async (req, res) => {

    // const result = await ProductService.getAll()
    // console.log(result)
    // if (result.statusCode === 500 || result.statusCode === 400) {
    //     return res.status(result.statusCode).send(result.response.error)
    // }
    // res.status(200).json({status: 'success', payload: result.response.payload})

    const { limit = 10, page = 1 } = req.query
    const pageFilters = {}

    if (req.query.category) pageFilters.category = req.query.category
    if (req.query.stock) pageFilters.stock = req.query.stock


    const paginateOpt = { lean: true, limit, page }

    if (req.query.sort === 'asc') paginateOpt.sort = { price: 1 }
    if (req.query.sort === 'des') paginateOpt.sort = { price: -1 }

    const result = await ProductService.dao.model.paginate(pageFilters, paginateOpt)

    if (!result) return {
        statusCode: 500,
        response: {
            status: 'error',
            error: result,
        }
    }
    let previousLink

    if (req.query.page) {

        const modifiedUrl = req.originalUrl.replace(`page=${req.query.page}`, `page=${result.prevPage}`)
        previousLink = `http://${req.hostname}:8080${modifiedUrl}`
    } else {
        previousLink = `http://${req.hostname}:8080${req.originalUrl}&page=${result.prevPage}`
    }
    let nextLink

    if (req.query.page) {

        const modifiedUrl = req.originalUrl.replace(`page=${req.query.page}`, `page=${result.nextPage}`)
        nextLink = `http://${req.hostname}:8080${modifiedUrl}`
    } else {
        nextLink = `http://${req.hostname}:8080${req.originalUrl}&page=${result.nextPage}`
    }

    return res.send({
        statusCode: 200,
        response: {
            status: 'success',
            payload: result.docs,
            totalPages: result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            previousLink: result.hasPrevPage ? previousLink : null,
            nextLink: result.hasNextPage ? nextLink : null
        }
    })
}

const getProductByIdController = async (req, res) => {
    const pid = req.params.pid
    const result = await ProductService.getById(pid)
    if (result.statusCode === 500 || result.statusCode === 400) {
        // return res.status(result.statusCode).send(result.response.error)
        try {
            CustomError.createError({
                name: "Error en busqueda de producto",
                cause: generateErrorInfoTwo(result.response.payload),
                message: "No se pudo obtener el producto por su ID",
                code: EErros.DATABASES_ERROR
            })
        } catch (err) {
            console.log(err)
        }
        res.status(result.statusCode).send('Producto no encontrado')
    }
    res.send(result.response.payload)
}
const addProductController = async (req, res) => {
    let { title, description, price, code, category, stock, thumbnail } = req.body

    const product = { title, description, price, code, category, stock, thumbnail }

    if (!title || !description || !price || !code || !category || !stock || !thumbnail) {

        const error = CustomError.createError({
            name: "ERROR EN LA CREACIÓN DEL PRODUCTO",
            cause: generateErrorInfo(product),
            message: "El producto no se pudo crear debido a que faltan propiedades.",
            code: EErros.INVALID_TYPES_ERROR
        })

        return res.status(400).send(error.cause)
    } else {

        const result = await ProductService.create(product)
        if (result.statusCode === 500) {
            const error = CustomError.createError({
                name: "ERROR EN LA CREACIÓN DEL PRODUCTO",
                cause: generateErrorInfo(product),
                message: `El producto no se pudo crear debido a que el codigo "${code}" ya existe`,
                code: EErros.PRODUCT_CODE
            })
            return res.status(result.statusCode).send(error.message)
        }
        res.status(result.statusCode).send(result.response.payload)
    }
}
const updateProductController = async (req, res) => {
    const pid = req.params.pid
    const productToUpdate = req.body
    const result = await ProductService.update(pid, productToUpdate)
    if (result.statusCode === 500) {
        return res.status(result.statusCode).send(result.response.error)
    }
    res.status(result.statusCode).send(result.response.payload)
}
const deleteProductController = async (req, res) => {
    const pid = req.params.pid
    const result = await ProductService.delete(pid)
    if (result.statusCode === 500) {
        return res.status(result.statusCode).send(result.response.error)
    }
    res.status(result.statusCode).send(result.response.payload)

}
export default { getProducts, getProductByIdController, addProductController, updateProductController, deleteProductController }