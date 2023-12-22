import { CartService, ProductService } from '../services/index.js'
import UserDTO from "../dto/userDTO.js"
import logger from '../utils/logger.js'
import dotenv from 'dotenv'
dotenv.config()


const getProductsViewController = async (req, res) => {

    const { limit = 8, page = 1 } = req.query
    const pageFilters = {}

    if (req.query.category) pageFilters.category = req.query.category
    if (req.query.stock) pageFilters.stock = req.query.stock

    const paginateOpt = { lean: true, limit, page }

    if (req.query.sort === 'asc') paginateOpt.sort = { price: 1 }
    if (req.query.sort === 'des') paginateOpt.sort = { price: -1 }

    const result = await ProductService.dao.model.paginate(pageFilters, paginateOpt)

    if (!result) {
        logger.error(`El usuario ${req.user.email} quiso acceder al carrito ${cid} y obtuvo un error`)

        return res.render("pageError", {
            error: 'La pagina que está buscando no existe!'
        })
    }
    let previousLink

    if (!req.query.page) {

    }

    if (req.query.page) {

        const modifiedUrl = req.originalUrl.replace(`page=${req.query.page}`, `page=${result.prevPage}`)
        previousLink = `http://${req.hostname}:8080${modifiedUrl}`
    } else {
        previousLink = `http://${req.hostname}:8080${req.originalUrl}?page=${result.prevPage}`

    }
    let nextLink

    if (req.query.page) {

        const modifiedUrl = req.originalUrl.replace(`page=${req.query.page}`, `page=${result.nextPage}`)
        nextLink = `http://${req.hostname}:8080${modifiedUrl}`
    } else {
        nextLink = `http://${req.hostname}:8080${req.originalUrl}?page=${result.nextPage}`

    }

    const totalPages = []
    let link

    for (let index = 1; index <= result.totalPages; index++) {
        if (!req.query.page) {

            link = `http://${req.hostname}:8080${req.originalUrl}?page=${index}`

        } else if (req.query.page > result.totalPages) {

            link = `http://${req.hostname}:8080${req.originalUrl}&page=${index}`
        }
        else {
            const modifiedUrl = req.originalUrl.replace(`page=${req.query.page}`, `page=${index}`)
            link = `http://${req.hostname}:8080${modifiedUrl}`

        }
        totalPages.push({ page: index, link })
    }

    if (result.page > totalPages.length || result.page < 1 || /[a-z]/i.test(result.page)) {
        return res.render("pageError", {
            error: 'La pagina que está buscando no existe!'
        })
    }
    const user = req.session.user
    return res.render("home",
        {
            user,
            products: result.docs,
            paginateInfo: {
                totalPages,
                prevPage: result.prevPage,
                nextPage: result.nextPage,
                page: result.page,
                hasPrevPage: result.hasPrevPage,
                hasNextPage: result.hasNextPage,
                previousLink: result.hasPrevPage ? previousLink : null,
                nextLink: result.hasNextPage ? nextLink : null
            }
        }
    )
}
const getProductByIdViewController = async (req, res) => {

    const pid = req.params.pid
    const user = req.session.user
    const product = await ProductService.getById(pid)
    if (product.statusCode === 500) {
        logger.error(`El usuario ${req.user.email} quiso ver el detalle del producto ${pid} y este no existe`)
        return res.status(404).render("pageError", {
            error: 'No pudimos encontrar el producto con este ID!!'
        })
    }

    res.status(200).render("productDetail", {
        product: product.response.payload,
        user,
        premium: user.role === 'premium' || user.role === 'admin' ? true : false
    })
}
const getProductsFromCartViewController = async (req, res) => {

    const cid = req.params.cid
    const cartProducts = await CartService.getAll(cid)
    const user = req.session.user
    if (cartProducts.statusCode === 500) {

        logger.error(`El usuario ${req.user.email} quiso acceder al carrito ${cid} y obtuvo un error`)
        return res.status(cartProducts.statusCode).render("pageError", {
            error: 'No pudimos encontrar el carrito con este ID!!'
        })
    }
    let amount = 0
    cartProducts.response.payload.products.map(prd => amount += prd.product.price)
    let finalPrice = amount * 1.2

    res.status(cartProducts.statusCode).render("cart", {
        user,
        cartProducts: cartProducts.response.payload.products,
        cartId: cartProducts.response.payload._id,
        subTotal: Math.round(amount),
        ship: Math.round(amount * 0.2),
        amount: Math.round(finalPrice)
    })
}
const getSessionUser = async (req, res) => {

    let user = req.session.user
    let userDTO = new UserDTO(user)
    res.render('sessions/profile', {
        user,
        userDTO,
        premium: user.role === 'premium' || user.role === 'admin' ? true : false
    })
}
export default { getProductsViewController, getProductByIdViewController, getProductsFromCartViewController, getSessionUser }