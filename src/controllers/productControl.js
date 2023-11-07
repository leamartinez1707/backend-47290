import ProductService from "../services/productService.js";

const productService = new ProductService()

const getProducts = async (req, res) => {

    const { limit = 10, page = 1 } = req.query
    const pageFilters = {}

    if (req.query.category) pageFilters.category = req.query.category
    if (req.query.stock) pageFilters.stock = req.query.stock


    const paginateOpt = { lean: true, limit, page }

    if (req.query.sort === 'asc') paginateOpt.sort = { price: 1 }
    if (req.query.sort === 'des') paginateOpt.sort = { price: -1 }

    // let result = await productService.getProductsService()
    const result = await productService.productDAO.model.paginate(pageFilters, paginateOpt)

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
    const result = await productService.getProductByIdService(pid)
    if (result.statusCode === 500 || result.statusCode === 400) {
        return res.status(result.statusCode).send(result.response.error)
    }
    res.send(result.response.payload)
}
const addProductController = async (req, res) => {
    let { title, description, price, code, category, stock, thumbnail } = req.body
    const product = { title, description, price, code, category, stock, thumbnail }
    const result = await productService.addProductService(product)
    if (result.statusCode === 500) {
        return res.status(result.statusCode).send(result.response.error)
    }
    res.status(result.statusCode).send(result.response.payload)
}
const updateProductController = async (req, res) => {
    const pid = req.params.pid
    const productToUpdate = req.body
    const result = await productService.updateProductService(pid, productToUpdate)
    if (result.statusCode === 500) {
        return res.status(result.statusCode).send(result.response.error)
    }
    res.status(result.statusCode).send(result.response.payload)
}
const deleteProductController = async (req, res) => {
    const pid = req.params.pid
    const result = await productService.deleteProductService(pid)
    if (result.statusCode === 500) {
        return res.status(result.statusCode).send(result.response.error)
    }
    res.status(result.statusCode).send(result.response.payload)

}
export default { getProducts, getProductByIdController, addProductController, updateProductController, deleteProductController }